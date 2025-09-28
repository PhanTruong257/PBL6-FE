import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supportedLanguages } from "@/config/i18n"

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState(i18n.language || "en")

  useEffect(() => {
    localStorage.setItem("language", currentLang)
  }, [currentLang])

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
    setCurrentLang(value)
  }

  const getCurrentLanguageName = () => {
    const language = supportedLanguages.find((lang) => lang.code === currentLang)
    return language ? `${language.flag} ${language.name}` : currentLang
  }

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={getCurrentLanguageName()} />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.flag} {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}