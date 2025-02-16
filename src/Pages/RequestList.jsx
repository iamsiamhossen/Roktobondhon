const RequestList = () => {
    const requests = [
      { name: "Alex", bloodGroup: "B+", hospital: "Apollo Dhaka" },
      { name: "Sara", bloodGroup: "AB-", hospital: "Square Hospital" },
    ];
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Blood Requests</h2>
        <ul>
          {requests.map((request, index) => (
            <li key={index} className="border p-2 mb-2">
              {request.name} - {request.bloodGroup} - {request.hospital}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RequestList;
  