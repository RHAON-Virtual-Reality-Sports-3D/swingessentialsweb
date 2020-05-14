import React, { useState, useEffect } from 'react';
import bg from '../assets/images/banners/landing.jpg';
import swing from '../assets/images/banners/swing3.jpg';
import order from '../assets/images/banners/order.jpg';
import lessons from '../assets/images/banners/lessons2.jpg';

import {
    makeStyles,
    createStyles,
    Button,
    // Slide,
    Theme,
    Typography,
    CircularProgress,
    useTheme,
    Grid,
    Switch,
    FormControlLabel,
} from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../__types__';
import { Banner } from '../components/display/Banner';
import { ROUTES } from '../constants/routes';

import { StyledTextField } from '../components/text/StyledInputs';
import { Spacer } from '@pxblue/react-components';
import { setUserData, UserDataChange } from '../redux/actions/user-data-actions';

import { ChangePassword } from '../components/dialogs/ChangePassword';
import { Section } from '../components/display/Section';
import { InfoCard } from '../components/display/InfoCard';
import { SET_USER_DATA, SET_USER_NOTIFICATIONS } from '../redux/actions/types';
import { setUserNotifications } from '../redux/actions/user-settings-actions';
import { AvatarPicker } from '../components/dialogs/AvatarPicker';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: '100%',
            maxWidth: 1024,
            color: 'white',
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                alignItems: 'center',
            },
        },
        imageWrapper: {
            flex: '0 0 auto',
            textAlign: 'center',
        },
        avatar: {
            height: 300,
            width: 300,
            borderRadius: 300,
            color: 'white',
            backgroundPosition: 'center center',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        name: {
            marginTop: theme.spacing(2),
        },
        aboutMe: {
            flex: '1 1 0px',
        },
    })
);

export const ProfilePage: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const token = useSelector((state: AppState) => state.auth.token);
    const loaded = useSelector((state: AppState) => state.api.authentication.initialized);
    const settingsLoaded = useSelector((state: AppState) => state.api.getUserSettings.status);
    const user = useSelector((state: AppState) => state.user);
    const _avatar = useSelector((state: AppState) => state.settings.avatar);

    // const [image, setImage] = useState('');

    const [initialized, setInitialized] = useState(false);
    const [avatarInitialized, setAvatarInitialized] = useState(false);
    const [avatar, setAvatar] = useState('');

    const joined = new Date(user.joined).getFullYear();

    useEffect(() => {
        if (!initialized && user.username) {
            setInitialized(true);
        }
    }, [user, initialized, setInitialized]);

    useEffect(() => {
        if (settingsLoaded === 'success' && !avatarInitialized && user.username) {
            setAvatarInitialized(true);
            setAvatar(
                `https://www.swingessentials.com/images/profiles/${
                    _avatar ? `${user.username}/${_avatar}.png` : 'blank.png'
                }`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, avatarInitialized, settingsLoaded, setAvatar]);

    if (loaded && !token) return <Redirect to={ROUTES.LOGIN} />;

    return (
        <>
            <Banner background={{ src: bg, position: 'center 70%', opacity: 0.5 }} justify={'center'}>
                {!initialized && (
                    <div style={{ color: 'white' }}>
                        <CircularProgress color={'inherit'} />
                    </div>
                )}
                {initialized && (
                    <div className={classes.root}>
                        <div className={classes.imageWrapper}>
                            <div
                                className={classes.avatar}
                                style={{
                                    backgroundColor: theme.palette.primary.light,
                                    backgroundImage: `url(${
                                        avatar || 'https://www.swingessentials.com/images/profiles/blank.png'
                                    })`,
                                }}
                            >
                                <AvatarPicker onImageChange={(newImage): void => setAvatar(newImage)} />
                            </div>
                            <div className={classes.name}>
                                <Typography variant={'h5'} style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                    {`${user.firstName} ${user.lastName}`}
                                </Typography>
                                <Typography variant={'h6'} style={{ lineHeight: 1.2 }}>
                                    {user.username}
                                </Typography>
                                <Typography variant={'caption'} display={'block'}>
                                    {`Member since ${joined}`}
                                </Typography>
                                <ChangePassword style={{ marginTop: 16 }} />
                            </div>
                        </div>

                        <Spacer flex={0} width={64} height={32} />

                        <ProfileForm />
                    </div>
                )}
            </Banner>

            <Section>
                <Grid container spacing={10} justify={'center'}>
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            spacing={10}
                            source={lessons}
                            title={'Your Lessons'}
                            aspectRatio={'16x9'}
                            backgroundPosition={'right center'}
                            description={'Check out all of your past lessons and see your progress.'}
                            onClick={(): void => {
                                history.push(ROUTES.LESSONS);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            spacing={10}
                            source={order}
                            title={'Order More'}
                            aspectRatio={'16x9'}
                            backgroundPosition={'center center'}
                            description={'Buy a single lesson or purchase in bulk for a discount.'}
                            onClick={(): void => {
                                history.push(ROUTES.ORDER);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            spacing={10}
                            source={swing}
                            title={'Submit Your Swing'}
                            aspectRatio={'16x9'}
                            backgroundPosition={'left center'}
                            description={'Send in your swing videos today to receive a professional analysis.'}
                            onClick={(): void => {
                                history.push(ROUTES.SUBMIT);
                            }}
                        />
                    </Grid>
                </Grid>
            </Section>
        </>
    );
};

export const ProfileForm: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const auth = useSelector((state: AppState) => state.auth);
    const user = useSelector((state: AppState) => state.user);
    const settings = useSelector((state: AppState) => state.settings);
    const updateData = useSelector((state: AppState) => state.api.updateUserData.status);
    const updateSettings = useSelector((state: AppState) => state.api.updateUserSettings.status);

    const loading = updateData === 'loading' || updateSettings === 'loading';
    const failure = updateData === 'failed' || updateSettings === 'failed';
    const success =
        (updateData === 'success' && (updateSettings === 'success' || updateSettings === 'initial')) ||
        (updateSettings === 'success' && (updateData === 'success' || updateData === 'initial'));

    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [sendEmails, setSendEmails] = useState(true);

    const [initialized, setInitialized] = useState(false);

    const changes =
        first !== user.firstName ||
        last !== user.lastName ||
        location !== user.location ||
        phone !== user.phone ||
        email !== user.email ||
        sendEmails !== settings.notifications;

    useEffect(() => {
        if (!initialized && user.username && settings.notifications !== undefined) {
            setFirst(user.firstName);
            setLast(user.lastName);
            setLocation(user.location || '');
            setPhone(user.phone || '');
            setEmail(user.email);
            setSendEmails(settings.notifications !== undefined ? settings.notifications : false);
            setInitialized(true);
        }
    }, [user, settings, initialized]);

    return (
        <div className={classes.aboutMe}>
            <Typography variant={'h5'}>Welcome to the Swing Essentials family!</Typography>
            <Typography paragraph>Help us get to know you by filling out your profile below.</Typography>

            <Typography variant={'subtitle1'} style={{ fontWeight: 600, marginTop: 16, marginBottom: 16 }}>
                About Me:
            </Typography>
            <StyledTextField
                label={'First Name'}
                name={'first-name'}
                value={first}
                onChange={(e): void => {
                    setFirst(e.target.value.replace(/[^A-Z-' ]/gi, '').substr(0, 32));
                }}
            />
            <StyledTextField
                label={'Last Name'}
                name={'last-name'}
                value={last}
                onChange={(e): void => {
                    setLast(e.target.value.replace(/[^A-Z-' ]/gi, '').substr(0, 32));
                }}
            />
            <StyledTextField
                label={'Location'}
                name={'location'}
                placeholder={'e.g. Portland, OR'}
                value={location}
                onChange={(e): void => {
                    setLocation(e.target.value.replace(/[^A-Z-', ]/gi, '').substr(0, 64));
                }}
            />
            <StyledTextField
                // last
                label={'Phone Number'}
                name={'phone'}
                placeholder={'e.g. 123-456-7890'}
                value={phone}
                onChange={(e): void => {
                    setPhone(e.target.value.replace(/[^0-9- +().]/gi, '').substr(0, 20));
                }}
            />
            <StyledTextField
                last
                disabled
                label={`Email Address ${
                    auth.role !== 'customer' && auth.role !== 'administrator' ? '(unverified)' : ''
                }`}
                name={'email'}
                value={email}
                onChange={(e): void => {
                    setEmail(e.target.value.substr(0, 128));
                }}
            />
            <Typography variant={'subtitle1'} style={{ fontWeight: 600, marginTop: 16, marginBottom: 16 }}>
                Notifications:
            </Typography>
            <FormControlLabel
                labelPlacement="start"
                control={
                    <Switch
                        checked={sendEmails}
                        color={'default'}
                        onChange={(e): void => setSendEmails(e.target.checked)}
                    />
                }
                label="New Lesson Emails"
                style={{ marginLeft: 0 }}
            />

            <div style={{ textAlign: 'center', marginTop: 16, minHeight: 36 }}>
                {initialized && changes && !loading /*(updateData === 'initial' && updateSettings === 'initial') && */ && (
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        onClick={
                            changes
                                ? (): void => {
                                      dispatch({ type: SET_USER_DATA.RESET });
                                      dispatch({ type: SET_USER_NOTIFICATIONS.RESET });
                                      const newChanges: UserDataChange = {};
                                      if (first !== user.firstName) newChanges.firstName = first;
                                      if (last !== user.lastName) newChanges.lastName = last;
                                      if (location !== user.location) newChanges.location = location;
                                      if (phone !== user.phone) newChanges.phone = phone;

                                      if (Object.keys(newChanges).length > 0) {
                                          dispatch(setUserData(newChanges));
                                      }
                                      if (email !== user.email) {
                                          // dispatch change email request
                                      }
                                      if (sendEmails !== settings.notifications) {
                                          dispatch(setUserNotifications({ subscribe: sendEmails }));
                                      }
                                  }
                                : undefined
                        }
                    >
                        Save Changes
                    </Button>
                )}
                {loading && <CircularProgress color={'inherit'} />}
                {success && !changes && <Typography variant={'caption'}>Success!</Typography>}
                {failure && !changes && <Typography variant={'caption'}>Failed to update profile</Typography>}
            </div>
        </div>
    );
};
