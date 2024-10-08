'use client'

import { useEffect, useState } from "react";
import { isMobileCheck } from "./shared";
import { BLURB_1, DEVELOPER_NAME, EMPLOYER_WEBSITE_URL, EMPLOYMENT_TAG_LINE, GITHUB_URL, LINKED_IN_URL, PAGE_SECTIONS, scrollEasingsFunction } from "./app-config";
import animateScrollTo from "animated-scroll-to";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let mousePositionY: number = 0
let intersectionObserver: IntersectionObserver | undefined = undefined

export default function Home() {
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [currentSection, setCurrentSection] = useState('')

  useEffect(() => {
    // update mobile status
    setIsMobile(isMobileCheck())

    // add a scroll listener and then apply ambient-occlusion to pointer
    document.addEventListener('scroll', () => {
      setIsPageScrolled(global.scrollY > 0)
      const pointer: HTMLElement = document.querySelector('.ambient-occlusion') as HTMLElement;
      pointer.style.top = (mousePositionY + scrollY) + 'px'
    })

    // add a resize listener to update mobile status
    window.addEventListener('resize', () => {
      setIsMobile(isMobileCheck())
    })

    // when the mouse is moved then we change the positioning of the background light
    document.addEventListener('mousemove', (event) => {
      const pointer: HTMLElement = document.querySelector('.ambient-occlusion') as HTMLElement;
      pointer.style.left = event.clientX + 'px'
      mousePositionY = event.clientY
      pointer.style.top = (event.clientY + global.scrollY) + 'px'
    });

    // setting up an intersection observer
    let about_checkpoints = [].slice.call(document.getElementsByClassName('about-checkpoint'))
    let experience_checkpoints = [].slice.call(document.getElementsByClassName('experience-checkpoint'))
    let projects_checkpoints = [].slice.call(document.getElementsByClassName('projects-checkpoint'))
    if(!intersectionObserver && about_checkpoints.length > 0 && about_checkpoints.length > 0 && about_checkpoints.length > 0) {
      var observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if(entry.isIntersecting == true) {
            handleIntersectionEntry(entry, setCurrentSection)
          }
        });
      }, {
        threshold: 1.0
      });
  
      let checkpoints = about_checkpoints.concat(experience_checkpoints).concat(projects_checkpoints)
      checkpoints.forEach((checkpoint) => {
        observer.observe(checkpoint);
      })
    }
  })

  let mainContentHtml: React.JSX.Element[] = []
  PAGE_SECTIONS.forEach((section) => {
    mainContentHtml = mainContentHtml.concat(section.display(section.cssClassName))
  })
  return (
    <main className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center bg-primary text-tertiary w-screen`}>
      <div className="ambient-occlusion"></div>
      <div className="left-12 bottom-0 ambient-occlusion-fixed-light"></div>
      <div className="right-0 top-0 ambient-occlusion-fixed-dark"></div>

        <div className={`sticky top-0 flex flex-col h-fit text-left ${isMobile ? 'w-screen bg-primary/75 p-2' : 'w-[25vw] min-w-[20rem] p-8 pt-20'}`}>
          <div>
            {
              !isMobile &&
              <p className={`text-6xl font-bold`}>{DEVELOPER_NAME}</p>
            }
            {
              EMPLOYER_WEBSITE_URL ?
              <p className={`text-xl font-semibold hover:cursor-pointer ${isMobile ? '' : 'pt-4'}`}><a href={EMPLOYER_WEBSITE_URL}>{EMPLOYMENT_TAG_LINE}</a></p>
              :
              <p className={`text-xl font-semibold ${isMobile ? '' : 'pt-4'}`}>{EMPLOYMENT_TAG_LINE}</p>
            }
            <p className={`font-thin text-tertiary/50 ${isMobile ? 'text-sm' : 'text-lg pt-8'}`}>{BLURB_1}</p>
            <div className={`${isMobile ? 'flex flex-row justify-between' : 'pt-16'}`}>
              {
                navigationHtml(currentSection, setCurrentSection)
              }
              {
                isMobile &&
                <div className="flex flex-row items-end">
                  <img className="h-16 px-2" src="./images/logo-transparent.png" alt="" />
                  <p>{DEVELOPER_NAME.substring(1)}</p>
                </div>
              }
            </div>
          </div>
      </div>
      <div className={`fixed flex items-center flex-row left-0 bottom-0 h-10 w-screen h-fit py-1 ${isMobile? 'bg-primary/90': ''}`}>
          <FontAwesomeIcon icon={faLinkedin} className="pl-4 h-8 text-secondary/50 hover:text-secondary hover:cursor-pointer" onClick={
            () => {
              window.location.href = LINKED_IN_URL
            }
          }></FontAwesomeIcon>
          <FontAwesomeIcon icon={faGithub} className="pl-4 h-8 text-secondary/50 hover:text-secondary hover:cursor-pointer" onClick={
            () => {
              window.location.href = GITHUB_URL
            }
          }></FontAwesomeIcon>
      </div>
      <div className={`flex flex-col p-8 pt-20 h-fit ${isMobile ? 'w-full m-auto' : 'w-[35vw] min-w-[40rem]'}`}>
        {
          mainContentHtml
        }
      </div>
    </main>
  )
}

function handleIntersectionEntry(entry: IntersectionObserverEntry, setCurrentSection: CallableFunction) {
  if(entry.isIntersecting) {
    let usableClassNames: string[] = []
    PAGE_SECTIONS.forEach((section) => {
      usableClassNames.push(section.cssClassName)
    }) 
    Array.from(entry.target.classList).forEach((className) => {
      if(usableClassNames.includes(className)) {
        setCurrentSection(className)
      }
    })
  }
}

function navigationHtml(currentSection: string, setCurrentSection: CallableFunction): React.JSX.Element {
  let navLinksHtml: React.JSX.Element[] = []

  let divHoverCss = 'text-tertiary/50 transition-all group-hover:scale-x-150 group-hover:text-tertiary group-hover:pl-4 group-hover:pr-8'
  let divSelectedCss = 'text-tertiary pl-4 pr-8'

  let pHoverCss = 'text-tertiary/50 group-hover:text-tertiary'
  let pSelectedCss = 'text-tertiary'
  PAGE_SECTIONS.forEach((section) => {
    let selected = section.cssClassName == currentSection
    navLinksHtml.push(
    <div className="flex flex-row items-center group hover:cursor-pointer" onClick={()=> {
      animateScrollTo(document.getElementById(`${section.cssClassName}-header`) as Element, {
        easing: scrollEasingsFunction,
        cancelOnUserAction: false
      })
    }}>
      <div className={`flex flex-row items-center pr-8 h-5 ${selected ? divSelectedCss : divHoverCss}`} >
        <hr className='h-1 w-16' />
      </div>
      <p className={selected ? pSelectedCss : pHoverCss}>{section.displayName}</p>
    </div>
    )
  })
  return (
    <div>
      {
        navLinksHtml
      }
    </div>
  )
}
