import type { NextPage } from 'next'
import Head from 'next/head'
import Ads from "../components/normal/home/Ads/Ads";
import DoubleSlider from "../components/view/DoubleSlider/DoubleSlider";
import React from "react";

const Home: NextPage = () => {

  return (
    <div className={'bg-background'}>
      <Head>
        <title>Unimun</title>
        <meta name="description" content="Unimun" />
      </Head>
      <main className={'h-full'}>
          <Ads/>
      </main>
    </div>
  )
}

export default Home
