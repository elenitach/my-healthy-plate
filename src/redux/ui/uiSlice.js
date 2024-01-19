import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuOpened: false,
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.menuOpened = !state.menuOpened;
        }
    }
})

export default uiSlice.reducer;

export const { toggleMenu } = uiSlice.actions;
export const selectMenuOpened = (state) => state.ui.menuOpened;