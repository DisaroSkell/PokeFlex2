'use client';

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { selectAutoValidateSetting, setAutoValidateSetting } from "@/src/lib/store/userSettings/userSettingsSlice";

import CheckboxWithLabel from "../checkboxWithLabel/component";

export default function AutoValidateToggle() {
    const { t } = useTranslation();
    const autoValidateSetting = useAppSelector(selectAutoValidateSetting);
    const dispatch = useAppDispatch();

    const setAutoValidate = useCallback((newValue: boolean) => {
        dispatch(setAutoValidateSetting(newValue));
    }, [dispatch]);

    return <>
        <CheckboxWithLabel
            label={t('toggle-autovalidate')}
            value={autoValidateSetting}
            onValueChange={setAutoValidate}
        />
    </>
}
