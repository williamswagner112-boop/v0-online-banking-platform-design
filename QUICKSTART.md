# NextBank - Quick Start Guide

Get up and running with the NextBank online banking platform in 5 minutes.

## Step 1: Prepare Your Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **Anon Key**

## Step 2: Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Initialize the Database

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Execute these scripts in order:
   - Copy contents of `scripts/01-extensions.sql` → Run
   - Copy contents of `scripts/02-core-tables.sql` → Run
   - Copy contents of `scripts/03-indexes-and-triggers.sql` → Run
   - Copy contents of `scripts/04-rls-policies.sql` → Run

## Step 4: Install Dependencies

```bash
pnpm install
```

Or if using npm:
```bash
npm install
```

## Step 5: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Test Accounts

After database initialization, use these test credentials:

**Demo User:**
- Email: `demo@nextbank.com`
- Password: `DemoPassword123!`

**Admin User:**
- Email: `admin@nextbank.com`
- Password: `AdminPassword123!`

---

## Main Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/register` | Create new account |
| `/login` | Sign in to account |
| `/dashboard` | Main banking dashboard |
| `/transfers` | Send money |
| `/transactions` | View history |
| `/profile` | Account settings |
| `/support` | Get help |
| `/admin` | Admin dashboard |

---

## What to Try First

1. **Register** a new account via `/register`
2. **Login** to see the dashboard `/dashboard`
3. **View** your accounts and balance
4. **Make a transfer** via `/transfers`
5. **Check** transaction history at `/transactions`
6. **Get help** at `/support`

---

## Features Included

✅ **Secure Authentication**
- Registration with validation
- Login with session management
- Password hashing with bcrypt

✅ **Banking Operations**
- Multiple account management
- Fund transfers between accounts
- Complete transaction history

✅ **Security**
- Fraud detection system
- Two-factor authentication framework
- Comprehensive audit logging

✅ **User Experience**
- Responsive mobile-first design
- Real-time form validation
- Helpful error messages

✅ **Support**
- Support ticket system
- FAQ section
- Account management

✅ **Admin Features**
- Platform analytics
- Fraud monitoring
- System health tracking

---

## Troubleshooting

### Database Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active

### SQL Scripts Not Running
- Ensure you're in the SQL Editor in Supabase
- Run scripts in order
- Copy entire script contents
- Check for syntax errors

### Development Server Won't Start
```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Port 3000 Already in Use
```bash
# Use different port
pnpm dev -p 3001
```

---

## Next Steps

1. **Customize Branding**
   - Update logo in `components/navbar.tsx`
   - Modify colors in `app/globals.css`
   - Edit company name throughout

2. **Add Your Logo**
   - Replace logo in navbar component
   - Update favicon in public folder

3. **Connect Real Payment Gateway** (Optional)
   - Integrate Stripe for real transfers
   - Add bank account linking
   - Implement actual fund movement

4. **Deploy to Vercel**
   - Push code to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

---

## Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial NextBank deployment"
git push origin main

# 2. Go to vercel.com
# 3. Import project from GitHub
# 4. Add environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
# 5. Deploy!
```

### Production Checklist

- [ ] Database is configured in Supabase
- [ ] Environment variables are set
- [ ] All SQL migrations are applied
- [ ] Custom domain is configured
- [ ] HTTPS is enabled
- [ ] Monitoring is set up
- [ ] Backups are scheduled

---

## Support

For detailed documentation:
- See [README.md](./README.md) for complete guide
- See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for technical details
- See [BANKING_PLATFORM_DESIGN.md](./BANKING_PLATFORM_DESIGN.md) for architecture

---

## File Locations

| File | Purpose |
|------|---------|
| `scripts/*.sql` | Database setup scripts |
| `app/` | Page components and routes |
| `components/` | Reusable UI components |
| `lib/` | Business logic and utilities |
| `.env.local` | Environment configuration |

---

## Development Tips

### View Database
- Login to Supabase dashboard
- Go to Table Editor
- Browse all tables and data

### Debug Network Requests
- Open DevTools (F12)
- Go to Network tab
- Monitor API calls

### Check Logs
- Supabase: View in Logs tab
- Browser: Open Console tab
- API responses: Check Network responses

### Clear Local Data
```bash
# Clear Next.js cache
rm -rf .next

# Clear browser storage
# Open DevTools → Application → Storage → Clear All
```

---

## Performance

The platform is optimized for:
- **Fast Load Times** - Minified assets, optimized images
- **Responsive Design** - Mobile-first CSS
- **Scalable Database** - Indexed queries, RLS policies
- **Efficient API** - Minimal data transfer

---

## Security

Production deployment should:
- ✅ Use HTTPS (automatic with Vercel)
- ✅ Enable RLS policies (included)
- ✅ Use secure cookies (configured)
- ✅ Implement rate limiting (ready to add)
- ✅ Add CSRF protection (ready to add)
- ✅ Monitor for suspicious activity (framework in place)

---

## Questions?

- Check the [README.md](./README.md)
- Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- Examine the code comments
- Check Supabase documentation
- Check Next.js documentation

---

**Ready to launch? You're all set! 🚀**

Start the dev server and begin building your banking platform.

```bash
pnpm dev
```

---

**Last Updated:** March 14, 2024
**Version:** 1.0.0
