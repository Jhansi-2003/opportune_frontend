import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import "./AdminDashboard.css";

// Eye-catching and professional color palette
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

const AdminDashboard = () => {
  const [listingData, setListingData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  useEffect(() => {
    fetchData();
    setDummyUserRegistrations();
  }, []);

  const fetchData = async () => {
    try {
      const adzunaResponse = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1`, {
        params: {
          app_id: "97c3856a",
          app_key: "852e595657093c70c34173e1d45cba8f",
          results_per_page: 50,
        },
      });

      const results = adzunaResponse.data.results;

      const jobs = results.filter((item) => item.category.label.toLowerCase().includes("jobs"));
      const internships = results.filter((item) => item.title.toLowerCase().includes("software"));
      const workshops = results.filter((item) => item.title.toLowerCase().includes("developer"));

      const totalJobs = jobs.length;
      const totalInternships = internships.length;
      const totalWorkshops = workshops.length;

      const activeJobs = Math.floor(totalJobs * 0.75);
      const activeInternships = Math.floor(totalInternships * 0.7);
      const activeWorkshops = Math.floor(totalWorkshops * 0.8);

      const expiredJobs = totalJobs - activeJobs;
      const expiredInternships = totalInternships - activeInternships;
      const expiredWorkshops = totalWorkshops - activeWorkshops;

      setListingData([
        { name: "Jobs", value: totalJobs },
        { name: "Internships", value: totalInternships },
        { name: "Workshops", value: totalWorkshops },
      ]);

      setActiveData([
        { name: "Active", value: activeJobs + activeInternships + activeWorkshops },
        { name: "Expired", value: expiredJobs + expiredInternships + expiredWorkshops },
      ]);

      setMonthlyGrowth([
        { month: "Jan", jobs: 20, internships: 5, workshops: 2 },
        { month: "Feb", jobs: 25, internships: 10, workshops: 5 },
        { month: "Mar", jobs: 30, internships: 12, workshops: 7 },
        { month: "Apr", jobs: totalJobs, internships: totalInternships, workshops: totalWorkshops },
      ]);
    } catch (error) {
      console.error("Error fetching listing data:", error);
    }
  };

  const setDummyUserRegistrations = () => {
    const activeUsers = 120;
    const inactiveUsers = 30;

    setUserData([
      { name: "Active Users", value: activeUsers },
      { name: "Inactive Users", value: inactiveUsers },
    ]);

    setUserGrowth([
      { month: "Jan", registrations: 15 },
      { month: "Feb", registrations: 20 },
      { month: "Mar", registrations: 25 },
      { month: "Apr", registrations: 30 },
      { month: "May", registrations: 18 },
      { month: "Jun", registrations: 22 },
      { month: "Jul", registrations: 27 },
      { month: "Aug", registrations: 35 },
      { month: "Sep", registrations: 40 },
      { month: "Oct", registrations: 38 },
      { month: "Nov", registrations: 45 },
      { month: "Dec", registrations: 50 },
    ]);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        {/* 📊 Bar Chart - Total Listings */}
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-2">Total Listings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={listingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {listingData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🟠 Pie Chart - Active vs. Expired */}
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-2">Active vs. Expired Listings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={activeData} dataKey="value" outerRadius={100}>
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 👥 Pie Chart - Active vs. Inactive Users */}
        <div className="chart-container w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-2">User Registrations (Active vs. Inactive)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userData} dataKey="value" outerRadius={100}>
                {userData.map((entry, index) => (
                  <Cell key={`user-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 📈 Line Chart - Growth Over Months */}
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-2">Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="jobs" stroke={COLORS[0]} strokeWidth={3} />
              <Line type="monotone" dataKey="internships" stroke={COLORS[1]} strokeWidth={3} />
              <Line type="monotone" dataKey="workshops" stroke={COLORS[2]} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>



        {/* 👤 Line Chart - User Growth Over Months */}
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-2">User Registrations Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="registrations" stroke={COLORS[4]} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;
