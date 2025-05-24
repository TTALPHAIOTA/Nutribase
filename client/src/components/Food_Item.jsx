import React, { useState, useEffect } from "react";

export default function Food_Item({
  initialData = null, // For editing
  onSubmitSuccess, // Callback when food is added/updated
  onCancel,
  username // Logged-in username
}) {
  const [formData, setFormData] = useState({
    _id: initialData?._id || null,
    name: initialData?.name || "",
    weight: initialData?.weight || "",
    dateAdded: initialData?.dateAdded || new Date().toISOString().slice(0, 16), // Default to now
    brand: initialData?.brand || "",
    price: initialData?.price || "",
    expiration_date: initialData?.expiration_date || "",
  });
  const [isEditing, setIsEditing] = useState(!!initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForWeight, setIsWaitingForWeight] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
     // If editing and initialData.weight is null and item was marked for weighing
     if (isEditing && initialData && initialData.weight === null && initialData.isAwaitingScaleInput) {
         setIsWaitingForWeight(true); // Resume waiting state if page was reloaded
     }
  }, [initialData, isEditing]);


  // Polling for weight if isWaitingForWeight is true
  useEffect(() => {
    let pollInterval;
    if (isWaitingForWeight && formData._id && username) { // Only poll if we have a foodId
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:5050/account/food-item/${username}/${formData._id}`);
          if (!res.ok) {
             // Handle error, maybe stop polling
             console.error("Polling error:", await res.text());
             setIsWaitingForWeight(false); // Stop waiting on error
             setErrorMessage("Failed to get weight update.");
             return;
          }
          const updatedFoodItem = await res.json();
          if (updatedFoodItem.weight !== null && !updatedFoodItem.isAwaitingScaleInput) {
            setFormData((prev) => ({ ...prev, weight: updatedFoodItem.weight.toString() }));
            setIsWaitingForWeight(false);
            setSuccessMessage("Weight captured from scale!");
            setTimeout(() => setSuccessMessage(""), 3000);
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error("Polling for weight failed:", err);
          setIsWaitingForWeight(false); // Stop waiting on error
          setErrorMessage("Error polling for weight.");
        }
      }, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(pollInterval);
  }, [isWaitingForWeight, formData._id, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetWeightFromScale = async () => {
    if (!username) {
      setErrorMessage("Username not found. Cannot get weight.");
      return;
    }
    setIsWaitingForWeight(true);
    setErrorMessage("");
    setSuccessMessage("");

    let currentFoodId = formData._id;

    try {
      // If it's a new item (no _id yet), first save it to get an ID
      if (!isEditing || !currentFoodId) {
         const tempFoodData = { ...formData, name: formData.name || "New Item", dateAdded: formData.dateAdded || new Date().toISOString().slice(0,10) };
         // Ensure essential fields are present before this preliminary save
         if (!tempFoodData.name || !tempFoodData.dateAdded) {
             setErrorMessage("Please enter at least Food Name and Date Added before getting weight.");
             setIsWaitingForWeight(false);
             return;
         }
         const addRes = await fetch(`http://localhost:5050/account/add-food`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ username, foodData: tempFoodData }),
         });
         if (!addRes.ok) throw new Error(await addRes.text() || "Failed to pre-save food item");
         const addedItem = await addRes.json();
         currentFoodId = addedItem.foodItem._id;
         setFormData(prev => ({ ...prev, _id: currentFoodId, name: addedItem.foodItem.name, dateAdded: addedItem.foodItem.dateAdded }));
         setIsEditing(true); // Now it's an existing item
      }

      // Now, tell backend to prepare this specific foodId for weighing
      const prepareRes = await fetch(`http://localhost:5050/account/food-item/${currentFoodId}/prepare-for-weighing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!prepareRes.ok) {
        throw new Error(await prepareRes.text() || "Failed to prepare for weighing");
      }
      setSuccessMessage("Ready for scale. Place item and press button on scale.");
      // Polling will start via useEffect
    } catch (err) {
      console.error("Error getting weight from scale:", err);
      setErrorMessage(`Error: ${err.message}`);
      setIsWaitingForWeight(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name || !formData.dateAdded) {
        setErrorMessage("Food Name and Date Added are required.");
        setIsLoading(false);
        return;
    }
    
    const payload = { ...formData, weight: formData.weight ? parseFloat(formData.weight) : null };
    delete payload._id; // Don't send _id in payload for add, or ensure PATCH handles it for update

    try {
      let response;
      if (isEditing && formData._id) {
        response = await fetch(`http://localhost:5050/account/food-item/${username}/${formData._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`http://localhost:5050/account/add-food`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, foodData: payload }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} food item`);
      }

      const result = await response.json();
      setSuccessMessage(`Food item ${isEditing ? 'updated' : 'added'} successfully!`);
      if (onSubmitSuccess) onSubmitSuccess(result.foodItem || { ...formData, _id: formData._id || result.foodItem?._id }); // Pass back the (potentially updated) item
      
      // Optionally clear form after successful add, or close modal via onCancel
      if (!isEditing) {
         // setFormData({ name: "", weight: "", dateAdded: new Date().toISOString().slice(0,16), brand: "", price: "", expiration_date: "" });
      }
      setTimeout(() => {
         setSuccessMessage("");
         if (onCancel && isEditing) onCancel(); // Close if editing
      }, 2000);

    } catch (err) {
      console.error("Error submitting food item:", err);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-fooditem" style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
      <h2>{isEditing ? "Edit Food Item" : "New Food Item"}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Date Added:</label>
          <input type="datetime-local" name="dateAdded" value={formData.dateAdded} onChange={handleChange} required />
        </div>
        <div>
          <label>Weight (grams):</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 250"
              step="any"
            />
            <button type="button" onClick={handleGetWeightFromScale} disabled={isWaitingForWeight || isLoading}>
              {isWaitingForWeight ? "Waiting for Scale..." : "Get from Scale"}
            </button>
          </div>
        </div>
        <div>
          <label>Brand (Optional):</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
        </div>
        <div>
          <label>Price (Optional):</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <div>
          <label>Expiration Date (Optional):</label>
          <input type="date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} />
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={isLoading || isWaitingForWeight}>
            {isLoading ? "Saving..." : (isEditing ? "Update Food Item" : "Add Food Item")}
          </button>
          {onCancel && <button type="button" onClick={onCancel} disabled={isLoading}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}