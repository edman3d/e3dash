import { useState } from 'react';
import { useBloodSugar } from '../../hooks/useBloodSugar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getESTDateTimeString, formatToEST, toUTCISOString } from '../../utils/timezone';
// Inline SVG Icons

interface BloodSugarFormData {
  value: string;
  measuredAt: string;
  notes: string;
}

export default function BloodSugarTracker() {
  const { readings, stats, chartData, loading, error, addReading, deleteReading, fetchChartData } = useBloodSugar();
  const [showForm, setShowForm] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('week');
  const [formData, setFormData] = useState<BloodSugarFormData>({
    value: '',
    measuredAt: getESTDateTimeString(),
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReading({
        value: parseFloat(formData.value),
        measuredAt: toUTCISOString(formData.measuredAt),
        notes: formData.notes || undefined,
      });
      setFormData({
        value: '',
        measuredAt: getESTDateTimeString(),
        notes: '',
      });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add blood sugar reading:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      try {
        await deleteReading(id);
      } catch (err) {
        console.error('Failed to delete reading:', err);
      }
    }
  };

  const handlePeriodChange = (period: string) => {
    setChartPeriod(period);
    fetchChartData(period);
  };

  if (loading && readings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          Blood Sugar Monitor
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center"
        >
          {showForm ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Add Reading
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Add New Reading</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                  Blood Sugar Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input"
                  placeholder="e.g., 95"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  Measured At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.measuredAt}
                  onChange={(e) => setFormData({ ...formData, measuredAt: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  placeholder="e.g., Before breakfast"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Reading'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="text-xs font-medium text-gray-500 block flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              Avg
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.avgValue.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block flex items-center justify-center">
              <svg className="w-3 h-3 mr-1 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              Min
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.minValue}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              Max
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.maxValue}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
              Total
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.totalReadings}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Blood Sugar Trends</h3>
          <select
            value={chartPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="input w-auto"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Average']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="avgValue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data available for the selected period.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Readings</h3>
        {readings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No blood sugar readings yet. Add your first reading above.
          </div>
        ) : (
          readings.map((reading) => (
            <div key={reading._id} className="card">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                  {reading.value}
                </span>
                <span className="text-sm text-gray-600">
                  {formatToEST(reading.measuredAt)}
                </span>
                <button
                  onClick={() => handleDelete(reading._id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0010 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  Delete
                </button>
              </div>
              {reading.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Notes:</strong> {reading.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
