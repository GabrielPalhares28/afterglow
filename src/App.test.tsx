import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

function renderApp() {
  return render(<BrowserRouter><App /></BrowserRouter>)
}

describe('Afterglow', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('cria uma tarefa e salva no navegador', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Nova tarefa' }))
    await user.type(screen.getByLabelText('O que você quer fazer?'), 'Preparar apresentação')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Adicionar tarefa' }))

    expect(await screen.findByRole('button', { name: 'Preparar apresentação' })).toBeInTheDocument()
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('afterglow-tasks') ?? '[]')).toEqual(expect.arrayContaining([
        expect.objectContaining({ title: 'Preparar apresentação', category: 'Pessoal', priority: 'Média' }),
      ]))
    })
  })

  it('alterna e persiste o tema', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }))

    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('daylight'))
    expect(JSON.parse(localStorage.getItem('afterglow-theme') ?? 'null')).toBe('daylight')
  })
})
