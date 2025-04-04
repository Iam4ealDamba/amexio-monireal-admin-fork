import {NgIconsModule} from "@ng-icons/core";
import {heroLink} from "@ng-icons/heroicons/outline";
import {heroPaperAirplaneSolid, heroTrashSolid, heroEyeSolid} from "@ng-icons/heroicons/solid";
import {matCheckCircle, matKeyboardReturn, matCheck} from "@ng-icons/material-icons/baseline"
import {matWarningRound, matErrorRound} from "@ng-icons/material-icons/round"
import {matCancel, matOpenInNew, matArrowBack, matSearch, matPlayCircle} from "@ng-icons/material-icons/baseline"
import {matFilterAltOutline} from "@ng-icons/material-icons/outline";

/**
 * This module contains all icons used in the application
 */
export const IconDefaultComponent = NgIconsModule.withIcons({
  heroLink,
  heroTrashSolid,
  heroPaperAirplaneSolid,
  matCheckCircle,
  matWarningRound,
  matErrorRound,
  matCancel,
  matCheck,
  matKeyboardReturn,
  matFilterAltOutline,
  matOpenInNew,
  matArrowBack,
  matSearch,
  matPlayCircle,
  heroEyeSolid
});