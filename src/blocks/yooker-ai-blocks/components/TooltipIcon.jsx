import React from "react";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export default function TooltipIcon({ type }) {
  const tooltipContent = () => {
    switch (type) {
      case "text":
        return `
          <div style="text-align: left;">
            <p>1. Vul onder 'Generate Input' in wat je wilt aanpassen.</p>
            <p>2. Klik op 'Generate Text' om de tekst te genereren.</p>
            <p>3. Controleer en pas de gegenereerde tekst aan waar nodig.</p>
            <strong>Belangrijk:</strong> Het is jouw verantwoordelijkheid om de gegenereerde tekst te controleren en te verbeteren.
          </div>
        `;

      case "title":
        return `
          <div style="text-align: left;">
            <p>Optie 1: Klik op 'Generate' om een titel te genereren op basis van de inhoud van de pagina.</p>
            <p>Optie 2: Klik op 'Extra Details' om aanvullende instructies mee te geven.</p>
            <strong>Belangrijk:</strong> Controleer altijd de gegenereerde tekst en pas deze aan indien nodig.
          </div>
        `;

      case "image":
        return `
            <div style="text-align: left;">
              <p>1. Beschrijf de afbeelding die je wilt genereren. Zorg dat de beschrijving duidelijk en specifiek is voor het beste resultaat.</p>
              <p>2. Klik op <strong>'Generate Image'</strong> om de afbeelding te laten genereren.</p>
              <p>3. Controleer de gegenereerde afbeelding zorgvuldig en klik op <strong>'Insert'</strong> om deze toe te voegen aan de pagina.</p>
              <strong>Belangrijk:</strong> Controleer altijd de gegenereerde afbeelding. Houd er rekening mee dat de afbeeldingen mogelijk niet perfect zijn en verdere aanpassingen nodig kunnen hebben.
            </div>
          `;

      case "landingspage":
        return `
            <div style="text-align: left;">
              <p>1. Kies een template voor de landingspagina.</p>
              <p>2. Selecteer de tekst die je wilt aanpassen.</p>
              <p>3. Vink de locatie-checkbox aan als het een locatie betreft.</p>
              <p>4. Als een locatie is aangevinkt, verschijnt de knop 'Generate'.</p>
              <p>5. Geef aan hoeveel locaties in de buurt van de 'naar'-locatie je wilt genereren.</p>
              <p>6. Klik op 'Meer aanpassen' om aanvullende woorden in de tekst te wijzigen.</p>
              <p>7. Voeg de landingspagina toe aan de wachtrij. Je kunt direct beginnen met genereren of meerdere landingspagina's aan de wachtrij toevoegen.</p>
              <strong>Belangrijk:</strong> Het is jouw verantwoordelijkheid, controleer de gegenereerde pagina zorgvuldig.
            </div>
          `;

      case "landingspage2":
        return `
              <div style="text-align: left;">
                <p>1. Kies een template voor de landingspagina.</p>
                <p>2. Selecteer het blok dat je wilt aanpassen. Houd <strong>CTRL</strong> ingedrukt om meerdere blokken te selecteren.</p>
                <p>3. Vink aan welke onderdelen je wilt aanpassen in de geselecteerde tekst.</p>
                <p>4. Vul in wat je wilt veranderen. Bijvoorbeeld: als de inhoud 'Eindhoven' bevat en je wilt dit aanpassen naar 'Hapert', vul dan 'Hapert' in.</p>
                <p>5. Vink extra opties aan om aanvullende aanpassingen toe te passen.</p>
                <p>6. Klik op <strong>Add New</strong> om een nieuwe landingspagina toe te voegen en herhaal stappen 1 tot en met 5 voor elke nieuwe pagina.</p>
                <p>7. Bekijk de wachtrij en klik op <strong>Generate</strong> om de landingspagina's te genereren.</p>
                <strong>Belangrijk:</strong> Het is jouw verantwoordelijkheid, controleer de gegenereerde pagina zorgvuldig voordat je deze publiceert.
              </div>
            `;

      case "product":
        return `
           <div style="text-align: left;">
             <p>1. Vul zo veel mogelijk infromatie in over het product voor het genereren van de productbeschrijving.</p>
             <p>2. Klik op 'Generate' om de productbeschrijving te genereren.</p>
             <p>3. Controleer de gegenereerde tekst en pas deze aan waar nodig.</p>
             <strong>Belangrijk:</strong> Het is jouw verantwoordelijkheid om de gegenereerde tekst te controleren en te verbeteren.
        `;

      default:
        return `
          <div style="text-align: left;">
            <p>Geen specifieke informatie beschikbaar voor dit type.</p>
          </div>
        `;
    }
  };

  const tooltipMaxWidth = () => {
    switch (type) {
      case "product":
        return "300px";
      case "landingspage":
        return "350px";
      case "landingspage2":
        return "350px";
      default:
        return "250px";
    }
  };

  return (
    <div aria-hidden="false">
      <FontAwesomeIcon
        icon={faCircleQuestion}
        style={{ fontSize: "18px", cursor: "pointer", marginBottom: "10px" }}
        data-tooltip-id="tooltip-id"
        data-tooltip-html={tooltipContent()}
      />
      <Tooltip
        id="tooltip-id"
        role="tooltip"
        aria-hidden={false}
        style={{
          maxWidth: tooltipMaxWidth(),
          whiteSpace: "normal",
          textAlign: "left",
          background: "black",
        }}
      />
    </div>
  );
}
