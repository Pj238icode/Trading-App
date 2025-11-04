# Use a Maven image to build the project
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Use a minimal JDK image for running the app
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/target/treading-plateform-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Set environment variables for Render (optional defaults)
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

# Run the jar
ENTRYPOINT ["java","-jar","app.jar"]
