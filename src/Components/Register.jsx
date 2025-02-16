import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registered Data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleRegister} className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input type="text" name="name" placeholder="Full Name" className="border p-2 mb-2 w-full" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="border p-2 mb-2 w-full" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="border p-2 mb-2 w-full" onChange={handleChange} />
        <input type="text" name="bloodGroup" placeholder="Blood Group" className="border p-2 mb-2 w-full" onChange={handleChange} />
        <button className="bg-red-500 text-white px-4 py-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
