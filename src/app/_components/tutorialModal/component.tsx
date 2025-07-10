'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/src/lib/store/hooks';
import { selectDisplayTutorialSetting, setDisplayTutorialSetting } from '@/src/lib/store/userSettings/userSettingsSlice';

import LanguageSelectors from '../languageSelectors/component';
import CustomButton from '../customButton/component';

import './tutorialModal.css';

export default function TutorialModal() {
    const { t } = useTranslation();
    const displayTutorialSetting = useAppSelector(selectDisplayTutorialSetting);
    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(true);

    const disableDisplayTutorial = useCallback(() => {
        dispatch(setDisplayTutorialSetting(false));
    }, [dispatch]);

    const onSkipTutorial = useCallback(() => {
        disableDisplayTutorial();
        setIsOpen(false);
    }, [disableDisplayTutorial]);

    return isOpen && displayTutorialSetting && <div className='tutorialModalBg'>
        <div className='pokeCard tutorialModal'>
            <h2>{t('common:welcome')}</h2>
            <div className="pokeCard">
                <LanguageSelectors />
            </div>
            <CustomButton
                label={t('common:confirm')}
                type={'secondary'}
                onClickCallback={onSkipTutorial}
            />
        </div>
    </div>;
}
