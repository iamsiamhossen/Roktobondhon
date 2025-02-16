const DonorList = () => {
    const donors = [
      { name: "John Doe", bloodGroup: "A+", location: "Dhaka" },
      { name: "Jane Smith", bloodGroup: "O-", location: "Chittagong" },
    ];
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Available Donors</h2>
        <ul>
          {donors.map((donor, index) => (
            <li key={index} className="border p-2 mb-2">
              {donor.name} - {donor.bloodGroup} - {donor.location}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default DonorList;
  