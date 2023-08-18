import type { NextPage } from "next";
import axios from 'axios';
import React, { useState } from "react";
import { useRouter } from 'next/router';

var FormData = require("form-data");

const Home: NextPage = () => {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [payresult, setPayresult] = useState("");

    const url = 'https://grandmafoods.com.ng/paystack_API';

    const route = useRouter();
    const form = new FormData();
    form.append('email', email);
    form.append('amount', amount);
    form.append('firstname', firstname);
    form.append('lastname', lastname);

    async function paystackpay(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const response = await axios.post(url, form, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const data = response.data;

            console.log(data.data.authorization_url);

            setPayresult(data.data.authorization_url);
            route.push(data.data.authorization_url);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-6 rounded shadow-lg">
                <div className="bg-green-500 text-white p-4 rounded">
                    <h3 className="text-center font-bold text-xl">Payment</h3>
                </div>
                <pre className="my-4">{payresult}</pre>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block font-medium mb-2">Email</label>
                        <input type="email" className="w-full border rounded-lg py-2 px-3" onChange={(e) => setEmail(e.target.value)} value={email} id="email" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block font-medium mb-2">Amount</label>
                        <input type="text" className="w-full border rounded-lg py-2 px-3" onChange={(e) => setAmount(e.target.value)} value={amount} id="amount" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor='firstname' className="block font-medium mb-2">Firstname</label>
                        <input type="text" className="w-full border rounded-lg py-2 px-3" onChange={(e) => setFirstname(e.target.value)} value={firstname} id="firstname" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastname" className="block font-medium mb-2">Lastname</label>
                        <input type="text" className="w-full border rounded-lg py-2 px-3" onChange={(e) => setLastname(e.target.value)} value={lastname} id="lastname" />
                    </div>
                    <button
                    type="button" // Use type="button" to prevent form submission
                    className="w-full bg-green-500 text-white py-2 rounded cursor-pointer"
                    onClick={paystackpay} // Assign the paystackpay function to onClick of the button
                    >
                    Pay with paystack
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Home;
