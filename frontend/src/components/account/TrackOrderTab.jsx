import React, {useState} from "react";

const TrackOrderTab = () => {
    const [orderId, setOrderId] = useState("");
    const [trackingInfo, setTrackingInfo] = useState(null);

    const handleTrack = () => {
        setTrackingInfo(`Tracking info for order #${orderId}`);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Track Your Order</h2>
            <div className="flex gap-2 mb-4">
                <input type="text" className="flex-1 p-2 border rounded" placeholder="Enter Order ID" value={orderId} onChage={e => setOrderId(e.target.value)}/>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleTrack}>Track</button>
            </div>
            {trackingInfo && (
                <div className="p-4 bg-gray-100 rounded">{trackingInfo}</div>
            )}
        </div>
    );
};

export default TrackOrderTab;