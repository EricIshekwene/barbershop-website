const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
res.cookie('adminSession', jwtTokenOrRandomSessionId, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: ONE_WEEK,
  path: '/',             // cookie is valid for the whole site
});
return res.json({ ok: true });

