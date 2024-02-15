import React, { useEffect } from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { useMyRegistrationStatus } from "../../hooks/use-my-registration-status"
import { ClubEvent } from "../../models/club-event"
import { getRegistrationTypeName, getStartTypeName } from "../../models/codes"
import { dayAndDateFormat, dayDateAndTimeFormat } from "../../utils/date-utils"
import { EditRegistrationButton } from "../buttons/edit-registration-button"
import { EventAdminButton } from "../buttons/event-admin-button"
import { EventPortalButton } from "../buttons/portal-button"
import { RegisterButton } from "../buttons/register-button"
import { RegisteredButton } from "../buttons/registered-button"
import { OverlaySpinner } from "../spinners/overlay-spinner"

export interface EventDetailProps {
  clubEvent: ClubEvent
  openings?: number
  onRegister: () => void
  onEditRegistration: () => void
}

export function EventDetail({ clubEvent, onRegister, onEditRegistration }: EventDetailProps) {
  const hasSignedUp = useMyRegistrationStatus(clubEvent.id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="card mb-4">
      <div className="card-body">
        <OverlaySpinner loading={!clubEvent?.id} />
        <div className="event-header">
          <div className="event-header--title">
            <h3 className="text-primary-emphasis">{clubEvent.name}</h3>
          </div>
          <div className="event-header--actions">
            <EventAdminButton clubEvent={clubEvent} />
            <EventPortalButton clubEvent={clubEvent} />
            <RegisteredButton clubEvent={clubEvent} />
            <EditRegistrationButton
              clubEvent={clubEvent}
              hasSignedUp={hasSignedUp}
              onClick={onEditRegistration}
            />
            <RegisterButton clubEvent={clubEvent} hasSignedUp={hasSignedUp} onClick={onRegister} />
          </div>
        </div>
        <div className="card-text">
          {clubEvent.status === "Canceled" ? <h4 className="text-danger">Canceled</h4> : null}
          <div className="registration-start-item">
            <div className="label">Event date:</div>
            <div className="value text-primary-emphasis fw-bold">
              {dayAndDateFormat(clubEvent.startDate)}
            </div>
          </div>
          <div className="registration-start-item">
            <div className="label">Start:</div>
            <div className="value">
              {clubEvent.startTime} {getStartTypeName(clubEvent.startType)}
            </div>
          </div>
          {clubEvent.registrationType !== "None" && (
            <React.Fragment>
              <div className="registration-start-item">
                <div className="label">Registration opens:</div>
                <div className="value">{dayDateAndTimeFormat(clubEvent.signupStart)}</div>
              </div>
              {clubEvent.prioritySignupStart && (
                <div className="registration-start-item">
                  <div className="label">Priority registration:</div>
                  <div className="value">{dayDateAndTimeFormat(clubEvent.prioritySignupStart)}</div>
                </div>
              )}
              <div className="registration-start-item">
                <div className="label">Registration closes:</div>
                <div className="value">{dayDateAndTimeFormat(clubEvent.signupEnd)}</div>
              </div>
              {clubEvent.paymentsEnd && (
                <div className="registration-start-item">
                  <div className="label">Skins closes:</div>
                  <div className="value">{dayDateAndTimeFormat(clubEvent.paymentsEnd)}</div>
                </div>
              )}
            </React.Fragment>
          )}
          <div className="registration-start-item">
            <div className="label">Registration type:</div>
            <div className="value">{getRegistrationTypeName(clubEvent.registrationType)}</div>
          </div>
          {hasSignedUp && (
            <p className="text-danger-emphasis">
              <strong>You are registered for this event.</strong>
            </p>
          )}
          <h4 className="text-primary" style={{ marginTop: "2rem" }}>
            Notes / Format
          </h4>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{clubEvent.notes}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
