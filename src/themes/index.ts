import { PXBlueColor } from '@pxblue/types';
import { SimplePaletteColorOptions } from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import * as ThemeColors from '@pxblue/colors';

const purple: PXBlueColor = {
    50: '#f1f0f4',
    100: '#bdbcd0',
    200: '#918fb0',
    300: '#656290',
    400: '#4F4C81', //'#444179',
    500: '#231f61',
    600: '#1f1b59',
    700: '#1a174f',
    800: '#151245',
    900: '#0c0a33',
    A100: '#726eff',
    A200: '#413bff',
    A400: '#0f08ff',
    A700: '#0700ed',
    contrastDefaultColor: 'light',
};
const typography = {
    fontFamily: '"Open Sans", Helvetica, Roboto, sans-serif',
    fontWeightMedium: 600,
};
const createSimplePalette = (color: PXBlueColor): SimplePaletteColorOptions => ({
    light: color[50],
    main: color[400],
    dark: color[500],
});

export const SETheme: ThemeOptions = {
    direction: 'ltr',
    typography: typography,
    palette: {
        type: 'light',
        primary: createSimplePalette(purple),
        secondary: createSimplePalette(ThemeColors.green),
        error: createSimplePalette(ThemeColors.red),
        background: {
            default: ThemeColors.gray['50'],
            paper: ThemeColors.white['50'],
        },
        text: {
            primary: purple['400'],
            secondary: ThemeColors.black['300'],
            hint: ThemeColors.gray['500'],
        },
        action: {
            active: purple[500],
            disabled: 'rgba(0, 0, 0, .25)',
        },
    },
    overrides: {
        // APP BAR OVERRIDES
        MuiAppBar: {
            colorDefault: {
                color: ThemeColors.black['500'],
                backgroundColor: ThemeColors.gray['50'],
            },
            colorSecondary: {
                backgroundColor: purple['700'],
            },
        },

        // BUTTON OVERRIDES
        MuiButton: {
            root: {
                textTransform: 'none',
            },
            outlined: {
                borderColor: ThemeColors.black[500],
            },
            outlinedPrimary: {
                borderColor: purple[500],
            },
            outlinedSecondary: {
                borderColor: ThemeColors.green[500],
            },
        },

        // BUTTON OVERRIDES
        MuiFab: {
            root: {
                textTransform: 'none',
            },
        },

        // LIST ITEM OVERRIDES
        MuiListItem: {
            root: {
                color: ThemeColors.black['500'],
            },
        },

        // TABS OVERRIDES
        MuiTabs: {
            indicator: {
                backgroundColor: ThemeColors.white['50'],
            },
        },
    },
};
