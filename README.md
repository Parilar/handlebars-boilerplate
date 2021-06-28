# Handlebars Boilerplate
## Getting Started
>**Step1:** npm install

>**Step2:** gulp dist

Damit wäre das Grundsetup erledigt

## Commandos
> gulp watch --namespace [Namespace]

Mit gulp watch startest du die Überwachung der Files welche OnSave kopiert und compiled werden. Die Angabe eine Namespace ist optional, der default Namespace ist **Templates**

Solltest du den Namepsace ändern, musst du das Beispiel in der **main.js** anpassen

# Struktur
Grundsätzlich werden alle Dateien im **src** Ordner erstellt und dann durch gulp in den dist Ordner verschoben und von dort aus im Browser angezeigt.

Bilder müssen Manuell in den **src** und in den **dist** Ordner kopiert werden da gulp nur bei einem Save Event getriggert wird und so die Bilder nicht erkennt