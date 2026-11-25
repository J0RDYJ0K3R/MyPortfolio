
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Login from '../pages/Login'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Login component behaviour', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('signs in successfully, stores the token and navigates home', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-auth-token'
      })
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(
      screen.getByLabelText('Email'),
      'test@example.com'
    )

    await user.type(
      screen.getByLabelText('Password'),
      'TestPassword123'
    )

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    )

    expect(
      await screen.findByRole('heading', { name: 'Home Page' })
    ).toBeInTheDocument()

    expect(sessionStorage.getItem('token'))
      .toBe('test-auth-token')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPassword123'
        })
      })
    )
  })

  it('displays an error when credentials are invalid', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials'
      })
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(
      screen.getByLabelText('Email'),
      'test@example.com'
    )

    await user.type(
      screen.getByLabelText('Password'),
      'WrongPassword'
    )

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    )

    expect(await screen.findByRole('alert'))
      .toHaveTextContent('Invalid credentials')

    expect(sessionStorage.getItem('token')).toBeNull()
  })

  it('rejects a successful response without an authentication token', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(
      screen.getByLabelText('Email'),
      'test@example.com'
    )

    await user.type(
      screen.getByLabelText('Password'),
      'TestPassword123'
    )

    await user.click(
      screen.getByRole('button', { name: 'Sign In' })
    )

    expect(await screen.findByRole('alert'))
      .toHaveTextContent('No authentication token received')

    expect(sessionStorage.getItem('token')).toBeNull()
  })
})
