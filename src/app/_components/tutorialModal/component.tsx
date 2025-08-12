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

    const [currentPanel, setCurrentPanel] = useState(0);

    const onCloseTutorial = useCallback(() => {
        dispatch(setDisplayTutorialSetting(false));
        setIsOpen(false);
    }, [dispatch]);

    const prevPanel = () => setCurrentPanel(current =>
        (current === 0 ? current : current - 1)
    )

    const nextPanel = () => setCurrentPanel(current =>
        (current === panels.length - 1 ? current : current + 1)
    )

    return isOpen && displayTutorialSetting && <div className='tutorialModalBg'>
        <div className='pokeCard tutorialModal'>
            <h1>{t('common:welcome')}</h1>
            {panels[currentPanel]()}
            <div className='navigateButtonsContainer'>
                <CustomButton
                    label='<'
                    type={'secondary'}
                    onClickCallback={prevPanel}
                    disabled={currentPanel === 0}
                />
                {
                    currentPanel === panels.length - 1 ?
                    <CustomButton
                        label={t('common:confirm')}
                        type={'secondary'}
                        onClickCallback={onCloseTutorial}
                    /> :
                    <CustomButton
                        label='>'
                        type={'secondary'}
                        onClickCallback={nextPanel}
                    />
                }
            </div>
        </div>
    </div>;
}

const panels = [
    LangPanel,
    QuizPresPanel,
    SettingsPresPanel,
    // EmptyPanel,
]

function LangPanel() {
    return <>
        <div className="pokeCard">
            <LanguageSelectors />
        </div>
        <p>Don't forget to validate for it to take effect. Next press on the arrow at the bottom right.</p>
    </>
}

function QuizPresPanel() {
    return <>
        Hello, here is an explaination of how quizzes work and presentation of their settings (for desktop AND mobile).
        <div className="quizSettings">Desktop explain</div>
        <div className="quizSettingsMobile">Mobile explain</div>
    </>
}

function SettingsPresPanel() {
    return <>And here we present the settings page.</>
}

function EmptyPanel() {
    return <></>
}
