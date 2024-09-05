import { Subscription } from "../../../model/Subscription/index.mjs";
import { User } from "../../../model/User/index.mjs";

export const subscribe = async (req, res) => {
    try {
        const U = req.user;
        const { card, subscriptionPlan } = req.body;

        const user = await User.findOne({id: U.id});
        const plan = await Subscription.findOne({name: subscriptionPlan});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!plan) {
            throw new Error("Subscription plan not found");
        }

        if (user.isSubscribed) {
            return res.status(400).json({ message: "User is already subscribed" });
        }

        const isCardValid = CheckCardAndTransferMoney(card, plan.paymentAmount);

        if (isCardValid) {
            user.isSubscribed = true;
            user.subscription = plan.id;
            await user.save();
    
            res.status(200).json({ message: "Subscription successful", user });
        }else {
            res.status(400).json({ message: "Insufficient balance"})
        }
    } catch (err) {
        res.status(500).json({ message: "Error subscribing", error: err });
    }
};