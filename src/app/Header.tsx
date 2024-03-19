import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { Bonbon , Miltonian} from 'next/font/google'

const bonbon = Bonbon({
  weight: '400',
  subsets: ['latin'],
})

const Header = () => (
    <div className="w-[900px] flex items-center border-0 h-[60px] fixed top-0">
        <div className="flex-grow"></div>
            <p className={`${bonbon.className} text-4xl font-bold text-white mx-auto absolute w-full text-center`}>Bitcoin Blackjack</p>
            <div className="flex-grow"></div>
            <div className="ml-auto z-10">
                <ConnectWallet />
        </div>
    </div>
);

export default Header;