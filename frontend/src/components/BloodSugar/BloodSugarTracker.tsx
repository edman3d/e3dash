import { useState } from 'react';
import { useBloodSugar } from '../../hooks/useBloodSugar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getESTDateTimeString, formatToEST } from '../../utils/timezone';
// Icons removed

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
        measuredAt: formData.measuredAt,
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
        <h2 className="text-2xl font-bold text-gray-900">
          Blood Sugar Monitor
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Reading'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <span className="text-xs font-medium text-gray-500 block">
              Avg
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.avgValue.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">
              Min
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.minValue}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">
              Max
            </span>
            <span className="text-sm font-bold text-gray-900">{stats.maxValue}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">
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
                <span className="text-lg font-semibold text-gray-900">
                  {reading.value}
                </span>
                <span className="text-sm text-gray-600">
                  {formatToEST(reading.measuredAt)}
                </span>
                <button
                  onClick={() => handleDelete(reading._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={loading}
                >
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
