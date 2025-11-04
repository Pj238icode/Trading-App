package com.zosh.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.ReadContext;
import com.zosh.model.CoinDTO;
import com.zosh.response.ApiResponse;
import com.zosh.response.FunctionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ChatBotServiceImpl implements ChatBotService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Use gemini-2.5-flash (free plan); set your API key in application.properties
    @Value("${gemini.api.key}")
    private String API_KEY;

    private static final String GEMINI_FLASH_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private double convertToDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        } else {
            try {
                return Double.parseDouble(value.toString());
            } catch (Exception e) {
                throw new IllegalArgumentException("Unsupported data type or value: " + value);
            }
        }
    }

    /**
     * Call CoinGecko and build CoinDTO (CoinDTO fields should match usage).
     */
    public CoinDTO makeApiRequest(String currencyName) {
        if (currencyName == null || currencyName.trim().isEmpty()) return null;

        String url = "https://api.coingecko.com/api/v3/coins/" + currencyName.toLowerCase().trim();
        try {
            ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> responseBody = responseEntity.getBody();
            if (responseBody == null) return null;

            Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
            Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

            CoinDTO coinInfo = new CoinDTO();
            coinInfo.setId((String) responseBody.get("id"));
            coinInfo.setSymbol((String) responseBody.get("symbol"));
            coinInfo.setName((String) responseBody.get("name"));
            if (image != null) coinInfo.setImage((String) image.get("large"));

            if (marketData != null) {
                Map<String, Object> currentPrice = (Map<String, Object>) marketData.get("current_price");
                Map<String, Object> marketCap = (Map<String, Object>) marketData.get("market_cap");
                Map<String, Object> totalVolume = (Map<String, Object>) marketData.get("total_volume");
                Map<String, Object> high24 = (Map<String, Object>) marketData.get("high_24h");
                Map<String, Object> low24 = (Map<String, Object>) marketData.get("low_24h");

                if (currentPrice != null) coinInfo.setCurrentPrice(convertToDouble(currentPrice.get("usd")));
                if (marketCap != null) coinInfo.setMarketCap(convertToDouble(marketCap.get("usd")));
                Object capRank = responseBody.get("market_cap_rank");
                if (capRank != null) coinInfo.setMarketCapRank((int) convertToDouble(capRank));
                if (totalVolume != null) coinInfo.setTotalVolume(convertToDouble(totalVolume.get("usd")));
                if (high24 != null) coinInfo.setHigh24h(convertToDouble(high24.get("usd")));
                if (low24 != null) coinInfo.setLow24h(convertToDouble(low24.get("usd")));

                coinInfo.setPriceChange24h(convertToDouble(marketData.get("price_change_24h")));
                coinInfo.setPriceChangePercentage24h(convertToDouble(marketData.get("price_change_percentage_24h")));
                coinInfo.setMarketCapChange24h(convertToDouble(marketData.get("market_cap_change_24h")));
                coinInfo.setMarketCapChangePercentage24h(convertToDouble(marketData.get("market_cap_change_percentage_24h")));
                coinInfo.setCirculatingSupply(convertToDouble(marketData.get("circulating_supply")));
                coinInfo.setTotalSupply(convertToDouble(marketData.get("total_supply")));
            }

            return coinInfo;
        } catch (HttpClientErrorException.NotFound nf) {
            // coin not found
            System.out.println("Coin not found: " + currencyName);
            return null;
        } catch (Exception e) {
            // other errors
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Query Gemini (free plan) using RestTemplate. Extract text and, if present, functionCall fields.
     * Returns FunctionResponse populated with:
     * - functionName (if model returned functionCall.name)
     * - currencyName (if model returned functionCall.args.currencyName)
     * - currencyData  (if model returned functionCall.args.currencyData else the plain text)
     */
    public FunctionResponse getFunctionResponse(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", API_KEY);

        String requestBody = "{\n" +
                "  \"contents\": [\n" +
                "    {\n" +
                "      \"parts\": [\n" +
                "        { \"text\": \"" + escapeForJson(prompt) + "\" }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        FunctionResponse res = new FunctionResponse();
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    GEMINI_FLASH_URL,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            String responseBody = response.getBody();
            System.out.println("Gemini API Response: " + responseBody);

            if (responseBody == null) {
                res.setFunctionName("error");
                res.setCurrencyName(null);
                res.setCurrencyData(null);
                return res;
            }

            ReadContext ctx = JsonPath.parse(responseBody);

            // Try to read function call values (if model returned them)
            try {
                String fnName = ctx.read("$.candidates[0].content.parts[0].functionCall.name");
                String currencyName = ctx.read("$.candidates[0].content.parts[0].functionCall.args.currencyName");
                String currencyData = ctx.read("$.candidates[0].content.parts[0].functionCall.args.currencyData");

                res.setFunctionName(fnName);
                res.setCurrencyName(currencyName);
                res.setCurrencyData(currencyData);
                return res;
            } catch (Exception ignored) {
                // functionCall not present; fall back to plain text
            }

            // Fallback: read generated text
            try {
                String aiText = ctx.read("$.candidates[0].content.parts[0].text");
                res.setFunctionName("none");
                res.setCurrencyName(null);
                res.setCurrencyData(aiText);
                return res;
            } catch (Exception e) {
                e.printStackTrace();
                res.setFunctionName("error");
                res.setCurrencyName(null);
                res.setCurrencyData("Could not parse Gemini response");
                return res;
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.setFunctionName("error");
            res.setCurrencyName(null);
            res.setCurrencyData("Gemini call error: " + e.getMessage());
            return res;
        }
    }

    /**
     * Get coin details: steps
     * 1) Ask Gemini (getFunctionResponse) to identify coin or provide the intent
     * 2) If coin name found, call CoinGecko (makeApiRequest)
     * 3) Send a summarization request back to Gemini with coin JSON to produce a friendly message
     */
    @Override
    public ApiResponse getCoinDetails(String prompt) {
        ApiResponse apiResponse = new ApiResponse();

        // 1) Ask Gemini for intent / function-like response
        FunctionResponse fr = getFunctionResponse(prompt);

        String detectedCoin = fr.getCurrencyName();
        // If model didn't return a currencyName, try to be helpful: attempt to extract first token
        if (detectedCoin == null || detectedCoin.trim().isEmpty()) {
            // best-effort: use prompt as coin name (user likely asked "bitcoin" or "tell me about bitcoin")
            detectedCoin = extractTokenFromPrompt(prompt);
        }

        // 2) Call CoinGecko
        CoinDTO coin = null;
        if (detectedCoin != null && !detectedCoin.isBlank()) {
            coin = makeApiRequest(detectedCoin);
        }

        // 3) Build a summarization prompt for Gemini (no tools)
        String coinJson = "No coin data found for '" + detectedCoin + "'";
        if (coin != null) {
            try {
                coinJson = mapper.writeValueAsString(coin);
            } catch (JsonProcessingException e) {
                coinJson = "Failed to serialize coin data";
            }
        }

        String summarizationPrompt = "User asked: " + prompt + "\n\n" +
                "Coin data (as JSON): " + coinJson + "\n\n" +
                "Produce a concise, user-friendly summary that includes:\n" +
                "- The coin name and symbol\n" +
                "- Current price (USD) and market cap\n" +
                "- 24h high/low and 24h change (value & %)\n" +
                "- A short 1-2 line explanation about the coin\n" +
                "If no coin data is available, reply that coin info couldn't be found and suggest checking the coin id on CoinGecko.";

        // Call Gemini to format the final message
        String finalText = callGeminiForText(summarizationPrompt);

        apiResponse.setMessage(finalText);
        return apiResponse;
    }

    @Override
    public CoinDTO getCoinByName(String coinName) {
        return this.makeApiRequest(coinName);
    }

    /**
     * Simple chat: forward prompt to Gemini (flash) and return raw response body
     */
    @Override
    public String simpleChat(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", API_KEY);

        String requestBody = "{\n" +
                "  \"contents\": [\n" +
                "    { \"parts\": [ { \"text\": \"" + escapeForJson(prompt) + "\" } ] }\n" +
                "  ]\n" +
                "}";

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_FLASH_URL, requestEntity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    /* ---------------------- Helper methods ---------------------- */

    private String callGeminiForText(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", API_KEY);

        String requestBody = "{\n" +
                "  \"contents\": [\n" +
                "    { \"parts\": [ { \"text\": \"" + escapeForJson(prompt) + "\" } ] }\n" +
                "  ]\n" +
                "}";

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_FLASH_URL, requestEntity, String.class);
            String body = response.getBody();
            if (body == null) return "No response from Gemini.";

            // extract best candidate text
            try {
                ReadContext ctx = JsonPath.parse(body);
                String aiText = ctx.read("$.candidates[0].content.parts[0].text");
                return aiText != null ? aiText : body;
            } catch (Exception e) {
                // fallback to returning raw body
                return body;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Gemini call failed: " + e.getMessage();
        }
    }

    private String extractTokenFromPrompt(String prompt) {
        if (prompt == null) return null;
        String p = prompt.trim().toLowerCase();
        // crude heuristics:
        // if prompt contains "about X" or "tell me about X" or "price of X", try to extract last token
        String[] tokens = p.split("\\s+");
        if (tokens.length == 1) return tokens[0];
        // try to find tokens after keywords
        String[] keywords = {"about", "price", "of", "tell", "tellme", "tell-me"};
        for (int i = 0; i < tokens.length; i++) {
            for (String kw : keywords) {
                if (tokens[i].contains(kw) && i + 1 < tokens.length) {
                    return tokens[i + 1].replaceAll("[^a-z0-9\\-]", "");
                }
            }
        }
        // fallback: return last token (could be coin id)
        return tokens[tokens.length - 1].replaceAll("[^a-z0-9\\-]", "");
    }

    private String escapeForJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}