import React, { useState } from "react";

export default function Food_Item() {
  const [formData, setFormData] = useState({
    brand: "",
    foodname: "",
    weight: "",
    price: "",
    expiration_date: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Food Item Added:", formData);
    setShowPopup(true); // Show the popup
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="create-fooditem">
      <h2>New Food Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="foodname"
            value={formData.foodname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Expiration Date:</label>
          <input
            type="text"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Food Item</button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Food Item Added!</h3>
            <p>Brand: {formData.brand}</p>
            <p>Name: {formData.foodname}</p>
            <p>Weight: {formData.weight}</p>
            <p>Price: {formData.price}</p>
            <p>Expiration Date: {formData.expiration_date}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
