import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const ourStyles = {
    box: {
        width: {
            xs: '100vw',
            sm: '100vw',
            md: '800px',
            lg: '800px',
        },
        margin: 'auto',
        marginTop: '3.5em',
        padding: 2
    },
    card: {
        color: 'white',
        backgroundColor: '#1E1E1E',
        borderRadius: '1em',
        margin: theme.spacing(2, 0),
        padding: theme.spacing(4),
        boxShadow: '0px 0px 15px #1E90FF', // Dodger Blue
        border: '2px outset #1E90FF'
    },
    faqcard: {
        color: 'white',
        backgroundColor: '#1E1E1E',
        borderRadius: '1em',
        margin: theme.spacing(2, 0),
        padding: theme.spacing(4),
        boxShadow: '0px 0px 5px #1E90FF', // Dodger Blue
        border: '1px outset #1E90FF'
    },
    childcard: {
        color: 'white',
        backgroundColor: '#1E1E1E',
        borderRadius: '1em',
        margin: theme.spacing(0, 0),
        padding: theme.spacing(1),
        boxShadow: '0px 0px 5px #1E90FF', // Dodger Blue
        border: '1px outset #1E90FF',
        textAlign: 'center'
    },
    deleteButton: {
        border: '1px outset #1E90FF', // Dodger Blue
        '&:hover': {
            borderColor: '#1E90FF',
            color: '#1E90FF',
        },
        padding: 0.7,
        borderRadius: '.15em'
    },
    divider: {
        borderColor: 'white',
        my: 2,
        color: 'white',
        fontSize: '25px'
    },
    firstTimeDivider: {
        '&::before, &::after': { borderColor: '#1E90FF' }, // Dodger Blue
        my: 1,
        color: 'white',
        fontSize: '25px'
    },
    gridItem: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
    },
    childGridItem: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
    },
    buttonbox: {
        maxWidth: 800,
        margin: 'auto',
        mt: 2,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    textField: {
        color: 'white',
        borderRadius: '1em',
        width: '100%',
        '& .MuiInputBase-input': {
            color: 'white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '2px outset white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiInputLabel-root': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& input::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)'
        }
    },
    textFieldTopEdit: {
        marginTop: 1,
        marginBottom: 1,
        color: 'white',
        borderRadius: '1em',
        width: '100%',
        '& .MuiInputBase-input': {
            color: 'white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '2px outset white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiInputLabel-root': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& input::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)'
        }
    },
    textFieldBottomEdit: {
        marginTop: 0,
        marginBottom: 1,
        color: 'white',
        borderRadius: '1em',
        width: '100%',
        '& .MuiInputBase-input': {
            color: 'white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '2px outset white',
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& .MuiInputLabel-root': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1E90FF' // Dodger Blue
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px outset #1E90FF', // Dodger Blue
            boxShadow: '1px 1px 1px black',
            borderRadius: '1em'
        },
        '& input::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)'
        }
    },
    stepLabel: {
        '&&&': {
            '.MuiStepLabel-label': {
                color: theme.palette.common.white,
            },
            '.MuiStepLabel-label.Mui-active': {
                color: '#1E90FF', // Dodger Blue
            },
            '.MuiStepLabel-label.Mui-completed': {
                color: '#4CAF50', // Keeping green for completed
            },
        },
    },
    continueButton: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        color: 'white',
        backgroundColor: '#1E90FF', // Dodger Blue
        '&:hover': {
            backgroundColor: '#1C86EE', // Slightly darker Dodger Blue
        },
    },
    backButton: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        color: theme.palette.common.white,
        border: "1px outset #1E90FF", // Dodger Blue

        '&:hover': {
            borderColor: '#1E90FF',
            color: '#1E90FF',
        },
    },
    loginContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: '1em',
        padding: theme.spacing(3),
        boxShadow: '0px 0px 20px black',
        border: '2px outset #1E90FF' // Dodger Blue
    },
    checkbox: {
        color: '#1E90FF', // Dodger Blue
        '&.Mui-checked': {
            color: '#1E90FF' // Dodger Blue
        }
    },
    header: {
        textAlign: 'center',
        fontSize: {
            xs: '35px',
            sm: '40px',
            md: '65px',
            lg: '65px',
        }
    },
    large: {
        fontSize: {
            xs: '30px',
            sm: '35px',
            md: '50px',
            lg: '50px',
        }
    },
    medium: {
        fontSize: {
            xs: '20px',
            sm: '25px',
            md: '35px',
            lg: '35px',
        }
    },
    small: {
        fontSize: {
            xs: '16px',
            sm: '16px',
            md: '25px',
            lg: '25px',
        }
    }
}

export default muiCustomStyles;
