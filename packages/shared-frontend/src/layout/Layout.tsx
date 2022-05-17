import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useEthers, useNotifications } from '@usedapp/core'
import blockies from 'blockies-ts'
import React from 'react'
import { getErrorMessage } from '../lib/utils'
import { Balance } from '../components/Balance'
import { ConnectWallet } from '../components/ConnectWallet'
import { Head, MetaProps } from './Head'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

/**
 * Prop Types
 */
interface NavbarLink {
  href: string
  label: string
}

interface LayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
  customMeta?: MetaProps
  navbarLinks?: NavbarLink[]
}

/**
 * Component
 */
export const Layout = ({
  children,
  customMeta,
  footer
}: LayoutProps): JSX.Element => {
  const { account, deactivate, error } = useEthers()
  const { notifications } = useNotifications()

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header className='absolute top-0 w-full'>
        <div className="p-4 flex justify-end items-center">
          {account ? (
            <>
              <Balance />
              <img className="mr-4 rounded" src={blockieImageSrc} alt="blockie" />
              <Menu placement="bottom-end">
                <MenuButton as={Button}>
                  <span className="text-sm">
                    {truncateHash(account)}
                  </span>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      deactivate()
                    }}
                  >
                    Disconnect
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </header>
      <main>
        {error && (
          <Alert status="error" mb="8">
            <AlertIcon />
            <AlertTitle mr={2}>Error:</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}
        {children}
        {notifications.map((notification) => {
          if (notification.type === 'walletConnected') {
            return null
          }
          return (
            <Alert
              key={notification.id}
              status="success"
              position="fixed"
              bottom="8"
              right="8"
              width="400px"
            >
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {TRANSACTION_TITLES[notification.type]}
                </AlertTitle>
                <AlertDescription overflow="hidden">
                  Transaction Hash:{' '}
                  {truncateHash(notification.transaction.hash, 61)}
                </AlertDescription>
              </Box>
            </Alert>
          )
        })}
      </main>
      <footer>
        {footer}
      </footer>
    </>
  )
}
