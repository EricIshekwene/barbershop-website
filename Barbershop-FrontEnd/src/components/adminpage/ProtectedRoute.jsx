import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, ok: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/session', {
          credentials: 'include',
        });
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            if (data?.authenticated) {
              setStatus({ loading: false, ok: true });
            } else {
              setStatus({ loading: false, ok: false });
              navigate('/admin/login', { replace: true });
            }
          } else {
            setStatus({ loading: false, ok: false });
            navigate('/admin/login', { replace: true });
          }
        }
      } catch (e) {
        if (!cancelled) {
          setStatus({ loading: false, ok: false });
          navigate('/admin/login', { replace: true });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  if (status.loading) return null; // or a spinner
  if (!status.ok) return null;
  return children;
}

