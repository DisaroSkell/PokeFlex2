'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/src/lib/store/hooks';
import { selectDisplayTutorialSetting, setDisplayTutorialSetting } from '@/src/lib/store/userSettings/userSettingsSlice';

import LanguageSelectors from '../languageSelectors/component';
import CustomButton from '../customButton/component';

import './tutorialModal.css';
import GenerationSelector from '../generationSelector/component';
import QuizOptionsSelectors from '../quizOptionsSelectors/component';

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
            {panels[currentPanel](t)}
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
]

function LangPanel(t: ReturnType<typeof useTranslation>['t']) {
    return <>
        <div className="pokeCard">
            <LanguageSelectors />
        </div>
        <p>{ t('tuto:language-explain') }</p>
    </>
}

function QuizPresPanel(t: ReturnType<typeof useTranslation>['t']) {
    return <>
        <p style={{ textAlign: 'justify' }} >{ t('tuto:quiz-desc') }</p>
        <div className='quizSettingsShowcase'>
            <div className='quizSettingsShowcaseItem'>
                <div className='pokeCard uninteractable'>
                    <GenerationSelector />
                </div>
                <p>{ t('tuto:gen-settings') }</p>
            </div>
            <div className='quizSettingsShowcaseItem'>
                <div className='uninteractable'>
                    <QuizOptionsSelectors />
                </div>
                <p>{ t('tuto:guess-settings') }</p>
            </div>
        </div>
        <div className="quizSettingsMobile">
            <p>{ t('tuto:mobile-menu') }</p>
            <div>{'=>'}</div>
            <div className="mockMenuArrow"></div>
        </div>
    </>
}
