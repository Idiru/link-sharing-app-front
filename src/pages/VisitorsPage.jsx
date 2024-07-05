import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Line, Bar } from 'react-chartjs-2'
import 'chart.js/auto';
import '../styles/pages/AnalyticsPage.css'

function AnalyticsPage() {
  const { contentId } = useParams();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalMonthlyClicks, setTotalMonthlyClicks] = useState(0)
  const [totalAnnualClicks, setTotalAnnualClicks] = useState(0)
  const [averageDailyClicks, setAverageDailyClicks] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/clicks/${contentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Analytics data:', data) // Log data received from backend
          setAnalyticsData(data)
          processAnalyticsData(data)
        } else {
          throw new Error('Failed to fetch analytics data')
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [contentId])

  const processAnalyticsData = (data) => {
    const dailyCounts = {}
    const monthlyCounts = {}
    let totalClicks = 0
    let totalMonthlyClicks = 0
    let totalAnnualClicks = 0
    let daysWithClicks = 0

    data.forEach((click) => {
      const date = new Date(click.clickTimestamp)
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` // dd/mm/yyyy
      const month = `${date.getMonth() + 1}/${date.getFullYear()}` // mm/yyyy

      if (!dailyCounts[formattedDate]) {
        dailyCounts[formattedDate] = 0
        daysWithClicks++
      }
      if (!monthlyCounts[month]) {
        monthlyCounts[month] = 0
      }

      dailyCounts[formattedDate]++
      monthlyCounts[month]++
      totalClicks++
    })

    const currentMonth = `${new Date().getMonth() + 1}/${new Date().getFullYear()}` // mm/yyyy
    totalMonthlyClicks = monthlyCounts[currentMonth] || 0

    const currentYear = new Date().getFullYear()
    totalAnnualClicks = Object.keys(monthlyCounts).reduce((acc, month) => {
      if (month.endsWith(`/${currentYear}`)) {
        acc += monthlyCounts[month]
      }
      return acc
    }, 0)

    // Convert dailyCounts and monthlyCounts to arrays and sort them
    const dailyCountsArray = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
    dailyCountsArray.sort((a, b) => {
      const dateA = new Date(`${a.date.split('/')[2]}-${a.date.split('/')[1]}-${a.date.split('/')[0]}`)
      const dateB = new Date(`${b.date.split('/')[2]}-${b.date.split('/')[1]}-${b.date.split('/')[0]}`)
      return dateA - dateB
    })

    const monthlyCountsArray = Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }))

    setDailyData(dailyCountsArray)
    setMonthlyData(monthlyCountsArray)
    setTotalClicks(totalClicks)
    setTotalMonthlyClicks(totalMonthlyClicks)
    setTotalAnnualClicks(totalAnnualClicks)
    setAverageDailyClicks(totalClicks / daysWithClicks)
  }

  const getCssVariableValue = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
    gradient.addColorStop(0, 'rgba(99,60,255,0.2)')
    gradient.addColorStop(1, 'rgba(99,60,255,0.6)')
    return gradient
  }

  // Prepare data for daily chart
  const dailyLabels = dailyData.map(item => item.date)
  const dailyCounts = dailyData.map(item => item.count)

  // Prepare data for monthly chart
  const monthlyLabels = monthlyData.map(item => item.month)
  const monthlyCounts = monthlyData.map(item => item.count)

  // Configuration for daily chart
  const dailyChartData = {
    labels: dailyLabels.map(date => date.split('/').reverse().join('-')), // Convert dd/mm/yyyy to yyyy-mm-dd for sorting
    datasets: [{
      label: 'Daily Clicks',
      data: dailyCounts,
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return null
        }
        return createGradient(ctx, chartArea)
      },
      borderColor: 'rgba(99,60,255,1)',
      tension: 0.1
    }]
  }

  // Configuration for monthly chart
  const monthlyChartData = {
    labels: monthlyLabels.slice().reverse(), // Reversed array of months
    datasets: [{
      label: 'Monthly Clicks',
      data: monthlyCounts.slice().reverse(), // Reversed array of counts
      backgroundColor: getCssVariableValue('--Purple') || '#633cff',
      barThickness: 20
    }]
  }

  // Render summary card function
  const renderSummaryCard = (title, mainValue, bgColor) => (
    <div className="summary-card" style={{ backgroundColor: bgColor }}>
      <h3>{title}</h3>
      <div className="main-value">{mainValue}</div>
    </div>
  )

  // Return the JSX of the component
  return (
    <div className="analytics-page">
      <h2>Analytics Page</h2>
      <p>Content ID: {contentId}</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {analyticsData.length > 0 ? (
            <div>
              <div className="summary-cards-container">
                {renderSummaryCard("Total Monthly Clicks", totalMonthlyClicks, "linear-gradient(135deg, rgba(60,150,255,0.8), rgba(60,150,255,0.6))")}
                {renderSummaryCard("Total Annual Clicks", totalAnnualClicks, "linear-gradient(135deg, rgba(255,150,60,0.8), rgba(255,150,60,0.6))")}
                {renderSummaryCard("Average Daily Clicks", averageDailyClicks.toFixed(2), "linear-gradient(135deg, rgba(99,60,255,0.8), rgba(99,60,255,0.6))")}
              </div>
              <div className="graphs-containerx">
                <div className="chart-container">
                  <h3>Daily Clicks</h3>
                  <Line ref={chartRef} data={dailyChartData} />
                </div>
                <div className="chart-container">
                  <h3>Monthly Clicks</h3>
                  <Bar data={monthlyChartData} />
                </div>
              </div>
            </div>
          ) : (
            <p>No analytics data available</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage