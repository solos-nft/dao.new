import {
  Box,
  Button,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react'
import { formatEther } from 'ethers/lib/utils'
import React, { useState } from 'react'
import {
  useIncrementalMinterMint,
  useMaxMintPerTx,
} from '../../lib/contractWrappers/minter'

export const IncrementalMinterMintForm = ({ tokenPrice }) => {
  const maxMintPerTx = useMaxMintPerTx()
  const [tokensToMint, setTokensToMint] = useState(1)
  const valueToSend = tokenPrice && tokenPrice.mul(tokensToMint)
  const { send: mint, state: mintState } = useIncrementalMinterMint()

  const mintClicked = () => {
    mint(tokensToMint, { value: valueToSend })
  }

  return (
    <div className="flex flex-col">
      <FormControl>
        <p className="text-center mb-4 font-semibold">Pieces to mint (max {maxMintPerTx}):</p>
        <NumberInput
          step={1}
          min={0}
          max={maxMintPerTx}
          value={tokensToMint}
          onChange={(_, n) => setTokensToMint(n)}
          className="flex flex-col items-center justify-center"
        >
          <NumberIncrementStepper className='!mb-4 p-4 !rounded-full bg-indigo-200 hover:bg-indigo-400 transition-colors' />
          <NumberInputField fontSize="30px" textAlign="center" padding={6} />
          <NumberDecrementStepper className='!mt-4 p-4 !rounded-full bg-indigo-200 hover:bg-indigo-400 transition-colors' />
        </NumberInput>
      </FormControl>
      <Button
        className='!bg-indigo-500 !hover:bg-indigo-300 text-white mt-5'
        onClick={mintClicked}
        isLoading={mintState.status === 'Mining'}
      >
        MINT {
        valueToSend && (
          <span className='font-semibold'>for ETH: {valueToSend && formatEther(valueToSend)}</span>
        )
      }
      </Button>

      <Box>
        {mintState.status !== 'None' ? `tx status: ${mintState.status}` : ''}
      </Box>
      <Box>
        {mintState.status === 'Exception' ? mintState.errorMessage : ''}
      </Box>
    </div>
  )
}
