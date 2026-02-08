import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    let event;

    try {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const { supabase_user_id, purchase_type } = session.metadata || {};

        if (supabase_user_id && purchase_type) {
            const updates: any = {};

            if (purchase_type === 'home') {
                updates.plan = 'home';
                updates.vehicles_limit = 3;
            } else if (purchase_type === 'family') {
                updates.plan = 'family';
                updates.vehicles_limit = 5;
            }

            if (Object.keys(updates).length > 0) {
                const { error } = await supabase
                    .from('profiles')
                    .update(updates)
                    .eq('id', supabase_user_id);

                if (error) {
                    console.error('Error updating profile:', error);
                    return res.status(500).json({ error: 'Database update failed' });
                }
            }
        }
    }

    res.status(200).json({ received: true });
}
