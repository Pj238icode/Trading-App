import { transferMoney } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";

const TransferForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT is missing");
      return;
    }

    if (!formData.walletId || !formData.amount || !formData.purpose) {
      console.error("All fields are required");
      return;
    }

    try {
      await dispatch(
        transferMoney({
          jwt,
          walletId: formData.walletId,
          reqData: {
            amount: Number(formData.amount), // convert to number
            purpose: formData.purpose,
          },
        })
      );

      console.log("Transfer successful", formData);

      // Reset the form
      setFormData({ amount: "", walletId: "", purpose: "" });

      // Call onClose if passed (close the dialog)
      if (onClose) onClose();
    } catch (err) {
      console.error("Transfer failed", err);
    }
  };

  return (
    <div className="pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Enter Amount</h1>
        <Input
          name="amount"
          onChange={handleChange}
          value={formData.amount}
          placeholder="$9999"
        />
      </div>
      <div>
        <h1 className="pb-1">Enter Wallet Id</h1>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          placeholder="#ADFE34456"
        />
      </div>

      <div>
        <h1 className="pb-1">Purpose</h1>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          placeholder="gift for your friend..."
        />
      </div>

      <Button onClick={handleSubmit} className="w-full p-7 text-xl">
        Send
      </Button>
    </div>
  );
};

export default TransferForm;
