'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const title = 'Language Selector';

const languageOptions = [
  { value: 'en', flag: '🇺🇸', labelKey: 'common:english' },
  { value: 'es', flag: '🇪🇸', labelKey: 'common:spanish' },
] as const;

const SelectLang = () => {
  const { t, i18n } = useTranslation('common');
  const [language, setLanguage] = useState(i18n.language || 'es');

  useEffect(() => {
    const currentLanguage = i18n.language;
    if (currentLanguage) {
      setLanguage(currentLanguage);
    }

    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const handleLanguageChange = (value: string) => {
    if (value === language) {
      return;
    }
    void i18n.changeLanguage(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label={t('changeLanguage')}>
          <Globe className="h-4 w-4" />
          {/* {t('language')} */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={handleLanguageChange} value={language}>
          {languageOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                {/* <span>{option.flag}</span> */}
                <span>{t(option.labelKey)}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectLang;
