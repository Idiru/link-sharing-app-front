import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AnalyticsPage() {
    const { contentId } = useParams();
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/clicks/${contentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Analytics data:', data); // Log data received from backend
                    setAnalyticsData(data);
                } else {
                    console.error('Failed to fetch analytics data');
                }
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalyticsData();
    }, [contentId]);

    return (
        <div>
            <h2>Analytics Page</h2>
            <p>Content ID: {contentId}</p>
            <div>
                {analyticsData.length > 0 ? (
                    <ul>
                        {analyticsData.map((click) => (
                            <li key={click._id}>
                                <p>Click Timestamp: {new Date(click.clickTimestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No analytics data available</p>
                )}
            </div>
        </div>
    );
}

export default AnalyticsPage;
