import type { NextPage } from 'next'
import Head from 'next/head'
import Appeals from "../components/normal/home/Appeals/Appeals";
import React from "react";

const Home: NextPage = () => {

  return (
    <div className={'bg-background h-full'}>
      <Head>
        <title>Unimun</title>
        <meta name="description" content="Unimun" />
      </Head>
      <main className={'h-full'}>
          <Appeals/>
      </main>
    </div>
  )
}

export default Home
