import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectAutoValidateSetting, setAutoValidateSetting } from "@/lib/store/userSettings/userSettingsSlice";

import CheckboxWithLabel from "@/components/checkboxWithLabel/component";

export default function AutoValidateToggle() {
    const { t } = useTranslation("settings");
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
    </>;
}
