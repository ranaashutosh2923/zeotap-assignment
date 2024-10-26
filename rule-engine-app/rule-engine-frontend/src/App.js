import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectItem } from './components/ui/select';

const App = () => {
  const [ruleString, setRuleString] = useState('');
  const [rules, setRules] = useState([]); // Will now store {id, ruleString} objects
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [evaluationData, setEvaluationData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: ''
  });
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleString })
      });
      const data = await response.json();
      // Store both the rule string and its MongoDB ID
      setRules([...rules, { id: data.id, ruleString }]);
      setRuleString('');
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedRuleId) {
      alert('Please select a rule to evaluate');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId: selectedRuleId,
          data: evaluationData
        })
      });
      const data = await response.json();
      setEvaluationResult(data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Rule Engine Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 grid gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Create Rule Section */}
          <Card className="shadow-md">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Create New Rule</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRule} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Rule Definition</label>
                  <textarea
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    placeholder="Enter rule string (e.g., age > 30 AND department = 'Sales')"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Create Rule
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Rules Section */}
          <Card className="shadow-md">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Existing Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No rules created yet</p>
                ) : (
                  rules.map((rule) => (
                    <div 
                      key={rule.id} 
                      className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <p className="font-mono text-sm text-gray-700">{rule.ruleString}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {rule.id}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          <Card className="shadow-md">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Evaluate Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Rule Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Rule</label>
                  <Select
                    value={selectedRuleId}
                    onValueChange={setSelectedRuleId}
                  >
                    {rules.map((rule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.ruleString}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      placeholder="Enter age"
                      value={evaluationData.age}
                      onChange={(e) => setEvaluationData({...evaluationData, age: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      placeholder="Enter department"
                      value={evaluationData.department}
                      onChange={(e) => setEvaluationData({...evaluationData, department: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                      type="number"
                      placeholder="Enter salary"
                      value={evaluationData.salary}
                      onChange={(e) => setEvaluationData({...evaluationData, salary: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <input
                      type="number"
                      placeholder="Enter years of experience"
                      value={evaluationData.experience}
                      onChange={(e) => setEvaluationData({...evaluationData, experience: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleEvaluate}
                  disabled={!selectedRuleId}
                  className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Evaluate Rules
                </button>
                {evaluationResult !== null && (
                  <div className={`p-4 rounded-md ${evaluationResult ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-center font-medium ${evaluationResult ? 'text-green-800' : 'text-red-800'}`}>
                      {evaluationResult ? '✓ Eligible' : '✗ Not Eligible'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default App;