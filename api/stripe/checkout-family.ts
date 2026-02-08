import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { userId, email } = req.body;

        if (!userId || !email) {
            return res.status(400).json({ error: 'Missing userId or email' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Pack Family (5 Vehicles)',
                            description: 'Upgrade to manage up to 5 vehicles.',
                        },
                        unit_amount: 2495,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/`,
            customer_email: email,
            metadata: {
                supabase_user_id: userId,
                purchase_type: 'family',
            },
        });

        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return res.status(500).json({ error: err.message });
    }
}
