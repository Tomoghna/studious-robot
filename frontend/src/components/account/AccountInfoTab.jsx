import React, {useState, useEffect} from "react";
import {useAuth} from "../../contexts/AuthContext";

const DEFAULT_AVATAR = "https://www.svgrepo.com/show/382106/avatar-boy-face-man-9.svg";

const AccountInfoTab = ({setFormChanged}) => {
    const {user} = useAuth();
    const [profilePic, setProfilePic] = useState(user?.avatar || DEFAULT_AVATAR);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    useEffect(() => {
        setFormChanged(true);
    }, [profilePic, name, email, phone, setFormChanged]);

    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setProfilePic(URL.createObjectURL(file));
            setFormChanged(true);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
                <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border"/>
                <div>
                    <label className="block mb-2 font-semibold">Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handlePicChange}/>
                </div>
            </div>
            <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input type="text" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input type="email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div>
                <label className="block mb-1 font-semibold">Phone Number</label>
                <input type="tel" className="w-full p-2 border rounded" value={phone} onChange={e => setPhone(e.target.value)}/>
            </div>
        </div>
    );
};

export default AccountInfoTab;