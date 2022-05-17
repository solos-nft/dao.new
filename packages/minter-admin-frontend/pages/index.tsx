import { Layout } from '@create-nft-dao/shared'
import { Minter } from '../components/Minter'
// import { NavbarLinks } from '../components/NavbarLinks'

// import NextLink from 'next/link'

const Mint = () => {
  const layoutProps = {
    title: 'Mint',
  }
// absolute top-0
// p-4 flex justify-end items-center mr-4 rounded w-full
  return (
    <Layout customMeta={layoutProps} footer={<></>}>
      <section className="h-96 bg-indigo-100 flex items-center justify-center">
        <p className='text-lg font-semibold'>Header</p>
      </section>
      <section className="max-w-5xl mx-auto py-10">
        <div className="flex flex-col justify-center items-center">
          <Minter />
        </div>
      </section>
    </Layout>
  )
}

export default Mint
