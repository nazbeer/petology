// import { Layout } from 'antd';
import Layout from "../../components/Layout";
import React , {useState} from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BreakTime = () => {
    const [duration, setDuration] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post('/api/set-break-time', { duration });
        
        if (response.data.success) {
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error('Error setting break time.');
      }
    };
    return (
        <Layout>
        <div className="card">
            <div className="card-header">
        <h5 className='mb-0'>Set Break Time</h5>
        </div>
        <div className="card-body">
        <form onSubmit={handleSubmit}>
            <div className="col-md-12 mb-3">
            <label htmlFor="duration">Select Duration:</label>
            </div>
            <div className="col-md-12  mb-3">
            <select id="duration" name="duration" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select duration...</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            </select>
            </div>
            <div className="col-md-12  mb-3">
            <button type="submit" className="btn btn-success btn-sm">Set Break Time</button>
            </div>
        </form>
        </div>
        </div>
        </Layout>
    )
}

export default BreakTime;