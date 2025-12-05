import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders');
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const socket = io('http://localhost:5000');

            socket.on('connect', () => {
                console.log('Socket connected');
            });

            socket.on('orderStatusUpdated', (data) => {
                setOrders(prevOrders => prevOrders.map(order =>
                    order._id === data.orderId ? { ...order, status: data.status } : order
                ));
            });

            return () => socket.disconnect();
        }
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) return <div className="text-center mt-10">Please login to view orders</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Preparing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Accepted': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Go ahead and order some delicious food!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-50 gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-6)}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Total Amount</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Items Ordered</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-white w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm shadow-sm text-gray-700">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-medium text-gray-800">{item.name}</span>
                                            </div>
                                            <span className="text-gray-600 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
