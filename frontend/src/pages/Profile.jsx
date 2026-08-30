import "../css/global.css";
import "../css/profile.css";
import Sidebar from "../components/Sidebar";

import { useEffect, useState } from "react";

function Profile() {

    const [profile, setProfile] = useState({
        name: "",
        age: "",
        family_size: "",
        city: "",
        city_type: "metropolitan",
        profession_type: "salaried"
    });


    // =========================
    // GET PROFILE
    // =========================

    useEffect(() => {

        const getProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Please login first");
                    return;
                }

                const response = await fetch(
                    "http://localhost:8080/api/profile",
                    {
                        method: "GET",

                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to load profile");
                    return;
                }

                setProfile({
                    name: data.name ?? "",
                    age: data.age ?? "",
                    family_size: data.family_size ?? "",
                    city: data.city ?? "",
                    city_type: data.city_type ?? "metropolitan",
                    profession_type: data.profession_type ?? "salaried"
                });

            } catch (error) {

                console.log("GET PROFILE ERROR:", error);
                alert("Failed to load profile");

            }
        };

        getProfile();

    }, []);


    // =========================
    // UPDATE PROFILE
    // =========================

    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            const profileData = {
                name: profile.name,

                age:
                    profile.age === ""
                        ? null
                        : Number(profile.age),

                family_size:
                    profile.family_size === ""
                        ? null
                        : Number(profile.family_size),

                city: profile.city,

                city_type: profile.city_type,

                profession_type: profile.profession_type
            };

            console.log("Sending profile data:", profileData);

            const response = await fetch(
                "http://localhost:8080/api/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify(profileData)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.log("UPDATE ERROR:", data);

                alert(
                    data.message || "Failed to update profile"
                );

                return;
            }

            setProfile({
                name: data.user.name ?? "",
                age: data.user.age ?? "",
                family_size: data.user.family_size ?? "",
                city: data.user.city ?? "",
                city_type:
                    data.user.city_type ?? "metropolitan",
                profession_type:
                    data.user.profession_type ?? "salaried"
            });

            alert("Profile updated successfully");

        } catch (error) {

            console.log("UPDATE PROFILE ERROR:", error);
            alert("Failed to update profile");

        }
    };


    return (

        <div className="profile-page">

            <Sidebar />

            <main className="profile-content">

                <div className="profile-header">

                    <h1>My Profile</h1>

                    <p>
                        Manage your personal information used for
                        financial analysis.
                    </p>

                </div>


                <div className="profile-card">

                    <form
                        className="profile-form"
                        onSubmit={updateProfile}
                    >


                        {/* NAME */}

                        <div className="form-group">

                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"

                                value={profile.name}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        name: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* AGE */}

                        <div className="form-group">

                            <label>Age</label>

                            <input
                                type="number"
                                name="age"
                                placeholder="Enter your age"

                                value={profile.age}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        age: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* CITY */}

                        <div className="form-group">

                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                placeholder="Enter your city"

                                value={profile.city}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        city: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* CITY TYPE */}

                        <div className="form-group">

                            <label>City Type</label>

                            <select
                                name="city_type"

                                value={profile.city_type}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        city_type: e.target.value
                                    })
                                }
                            >

                                <option value="metropolitan">
                                    Metropolitan
                                </option>

                                <option value="non_metropolitan">
                                    Non-Metropolitan
                                </option>

                                <option value="small_town">
                                    Small Town
                                </option>

                            </select>

                        </div>


                        {/* FAMILY SIZE */}

                        <div className="form-group">

                            <label>Family Size</label>

                            <input
                                type="number"
                                name="family_size"
                                placeholder="Number of family members"

                                value={profile.family_size}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        family_size: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* PROFESSION TYPE */}

                        <div className="form-group">

                            <label>Profession Type</label>

                            <select
                                name="profession_type"

                                value={profile.profession_type}

                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        profession_type: e.target.value
                                    })
                                }
                            >

                                <option value="salaried">
                                    Salaried Employee
                                </option>

                                <option value="self_employed">
                                    Self-Employed
                                </option>

                                <option value="business">
                                    Business Owner
                                </option>

                                <option value="freelancer">
                                    Freelancer / Professional
                                </option>

                                <option value="agriculture">
                                    Agricultural / Farming
                                </option>

                                <option value="student">
                                    Student
                                </option>

                                <option value="retired">
                                    Retired
                                </option>

                                <option value="homemaker">
                                    Homemaker
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* SAVE BUTTON */}

                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="save-profile"
                            >
                                Save Profile
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default Profile;