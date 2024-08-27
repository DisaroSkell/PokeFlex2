'use client';

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import CheckboxWithLabel from "../checkboxWithLabel/component";
import TimeSlider from "../customSlider/timeSlider";

import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { setAutoGiveupSetting } from "@/src/lib/store/userSettings/userSettingsSlice";

export default function AutoGiveupSelector() {
    const { t } = useTranslation();

    const autoGiveupSetting = useAppSelector(state => state.userSettings.autoGiveup)
    const dispatch = useAppDispatch();

    const setAutoGiveup = useCallback((newValue: boolean) => {
        dispatch(setAutoGiveupSetting({
            enabled: newValue,
            selectedTimeBeforeGiveup: autoGiveupSetting.selectedTimeBeforeGiveup,
        }));
    }, [dispatch, autoGiveupSetting.selectedTimeBeforeGiveup]);

    const setSelectedTimeBeforeGiveup = useCallback((newValue: number) => {
        dispatch(setAutoGiveupSetting({
            enabled: autoGiveupSetting.enabled,
            selectedTimeBeforeGiveup: newValue,
        }));
    }, [dispatch, autoGiveupSetting.enabled]);

    return <div className="timerSliderContainer">
        <CheckboxWithLabel
            key={"autogiveup"}
            label={t("auto-giveup")}
            value={autoGiveupSetting.enabled}
            onValueChange={setAutoGiveup}
        />
        <TimeSlider
            min={1}
            max={5 * 60}
            value={autoGiveupSetting.selectedTimeBeforeGiveup}
            label={t("time-before-giveup")}
            onChange={setSelectedTimeBeforeGiveup}
            disabled={!autoGiveupSetting.enabled}
        />
    </div>
}
