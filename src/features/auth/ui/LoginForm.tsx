'use client'

import { Alert, Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { useAppDispatch } from '@/app/store/hooks'
import { hydrateSession } from '@/features/auth/model/authSlice'
import {
	useLoginMutation,
	useRegisterMutation,
} from '@/shared/api/taskManagerApi'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export const LoginForm = () => {
	const dispatch = useAppDispatch()
	const [isRegisterMode, setIsRegisterMode] = useState(false)

	const [username, setUsername] = useState('emilys')
	const [password, setPassword] = useState('emilyspass')
	const [firstName, setFirstName] = useState('Test')
	const [lastName, setLastName] = useState('User')
	const [email, setEmail] = useState('test.user@example.com')

	const [login, { error: loginError, isLoading: isLoginLoading }] =
		useLoginMutation()
	const [register, { error: registerError, isLoading: isRegisterLoading }] =
		useRegisterMutation()

	const activeError = isRegisterMode ? registerError : loginError
	const isLoading = isRegisterMode ? isRegisterLoading : isLoginLoading

	const errorMessage =
		activeError &&
		'data' in activeError &&
		typeof activeError.data === 'object' &&
		activeError.data &&
		'message' in activeError.data
			? String(activeError.data.message)
			: null

	const handleLogin = async (): Promise<void> => {
		try {
			const response = await login({ password, username }).unwrap()
			dispatch(hydrateSession(response.accessToken))
			toast.success('Вход выполнен')
		} catch {
			toast.error('Не удалось войти')
		}
	}

	const handleRegister = async (): Promise<void> => {
		try {
			await register({
				email,
				firstName,
				lastName,
				password,
				username,
			}).unwrap()
			toast.success('Регистрация успешна. Выполняю вход...')
			await handleLogin()
		} catch {
			toast.error('Не удалось зарегистрироваться')
		}
	}

	const handleSubmit = async (): Promise<void> => {
		if (isRegisterMode) {
			await handleRegister()
			return
		}

		await handleLogin()
	}

	return (
		<Box sx={{ maxWidth: 460 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>Task Manager</Typography>
				<Typography variant='body2' color='text.secondary'>
					{isRegisterMode
						? 'Регистрация нового пользователя'
						: 'Авторизация пользователя'}
				</Typography>

				<Input
					id='login-username'
					label='Username'
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
				<Input
					id='login-password'
					label='Password'
					type='password'
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder='asdasd'
				/>

				{isRegisterMode ? (
					<>
						<Input
							id='register-first-name'
							label='First name'
							value={firstName}
							onChange={(event) => setFirstName(event.target.value)}
						/>
						<Input
							id='register-last-name'
							label='Last name'
							value={lastName}
							onChange={(event) => setLastName(event.target.value)}
						/>
						<Input
							id='register-email'
							label='Email'
							type='email'
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</>
				) : null}

				{errorMessage ? <Alert severity='error'>{errorMessage}</Alert> : null}

				<Button variant='contained' onClick={handleSubmit} disabled={isLoading}>
					{isLoading
						? 'Выполняется...'
						: isRegisterMode
							? 'Зарегистрироваться'
							: 'Войти'}
				</Button>

				<Button
					variant='text'
					onClick={() => setIsRegisterMode((prevState) => !prevState)}
				>
					{isRegisterMode ? 'У меня уже есть аккаунт' : 'Создать аккаунт'}
				</Button>
			</Stack>
		</Box>
	)
}
