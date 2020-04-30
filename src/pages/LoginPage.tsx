import React, { useState, useEffect } from 'react';
import bg from '../assets/images/banners/landing.jpg';

import { makeStyles, createStyles, Typography, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../__types__';
import { requestLogin } from '../redux/actions/auth-actions';
import { Banner } from '../components/display/Banner';

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            width: '80%',
            maxWidth: 512,
            color: 'white',
        },
        input: {
            background: 'rgba(255,255,255,0.6)',
            '&:hover': {
                background: 'rgba(255,255,255,0.8)',
            },
            '&$focused': {
                background: 'rgba(255,255,255,1)',
            },
        },
        focused: {
            background: 'rgba(255,255,255,1)',
            '&:hover': {
                background: 'rgba(255,255,255,1)',
            },
            '&$focused': {
                background: 'rgba(255,255,255,1)',
            },
        },
    })
);

export const LoginPage: React.FC = (): JSX.Element | null => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const token = useSelector((state: AppState) => state.auth.token);
    const failCount = useSelector((state: AppState) => state.auth.failCount);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (failCount > 0) {
            setPassword('');
        }
    }, [failCount, setPassword]);

    if (token) {
        history.goBack();
        return null;
    }
    return (
        <>
            <Banner background={{ src: bg, position: 'center 70%' }} justify={'center'}>
                <div className={classes.form}>
                    <TextField
                        fullWidth
                        variant={'filled'}
                        label={'Username'}
                        placeholder={'Username or Email'}
                        name={'username'}
                        value={username}
                        onChange={(e): void => {
                            setUsername(e.target.value);
                        }}
                        InputProps={{
                            classes: {
                                root: username ? classes.focused : classes.input,
                                focused: classes.focused,
                            },
                        }}
                        style={{ marginBottom: 16 }}
                    />
                    <TextField
                        fullWidth
                        variant={'filled'}
                        type={'password'}
                        label={'Password'}
                        name={'password'}
                        value={password}
                        onChange={(e): void => {
                            setPassword(e.target.value);
                        }}
                        InputProps={{
                            classes: {
                                root: password ? classes.focused : classes.input,
                                focused: classes.focused,
                            },
                        }}
                        style={{ marginBottom: 16 }}
                    />
                    {failCount > 0 && (
                        <div
                            style={{
                                padding: 20,
                                background: '#ca3c3d',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Typography>Your username / password was not correct. Please try again.</Typography>
                        </div>
                    )}
                    <Button
                        fullWidth
                        variant={'contained'}
                        color={!username || !password ? 'default' : 'primary'}
                        disabled={!username || !password}
                        onClick={(): void => {
                            dispatch(requestLogin({ username, password }));
                        }}
                    >
                        Sign In
                    </Button>
                </div>
            </Banner>
        </>
    );
};