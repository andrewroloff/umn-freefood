import React, { useEffect, useState } from 'react';

export default function App() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        datetime: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false); // new state

    const loadEvents = async () => {
        try {
            const res = await fetch('/events');
            const data = await res.json();
            setEvents(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load events');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
        const interval = setInterval(loadEvents, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://umn-freefood.onrender.com/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Failed to post event');
            setForm({ title: '', description: '', location: '', datetime: '' });
            loadEvents();
        } catch (err) {
            console.error(err);
            setError('Failed to post event');
        }
    };

    // Format datetime without seconds
    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Dynamic styles for dark/light mode
    const pageStyle = {
        maxWidth: 700,
        margin: '20px auto',
        fontFamily: 'Arial',
        background: darkMode ? '#121212' : '#f0f0f0',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
        padding: '20px',
    };

    const cardStyle = {
        background: darkMode ? '#1e1e1e' : '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        boxShadow: darkMode ? '0 2px 5px rgba(0,0,0,0.5)' : '0 2px 5px rgba(0,0,0,0.1)'
    };

    const inputStyle = {
        width: '100%',
        marginBottom: 5,
        padding: 8,
        background: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        border: '1px solid',
        borderColor: darkMode ? '#555' : '#ccc',
        borderRadius: 4,
    };

    return (
        <div style={pageStyle}>
            <h1>UMN Free Food</h1>
            <button
                onClick={() => setDarkMode(!darkMode)}
                style={{ marginBottom: 20, padding: 10 }}
            >
                Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                    style={inputStyle}
                />
                <input
                    type="datetime-local"
                    value={form.datetime}
                    onChange={e => setForm({ ...form, datetime: e.target.value })}
                    required
                    style={inputStyle}
                />
                <button type="submit" style={{ padding: 10 }}>Post Event</button>
            </form>

            {loading && <p>Loading events...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {events.length === 0 && !loading ? (
                <p>No upcoming free food events.</p>
            ) : (
                events.map(event => (
                    <div key={event._id} style={cardStyle}>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>When:</strong> {formatDateTime(event.datetime)}</p>
                    </div>
                ))
            )}
        </div>
    );
}
